"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export type PublicProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: "Visitor" | "Admin";
  experience_level: string | null;
};

export type OnlineUser = Pick<PublicProfile, "id" | "display_name" | "avatar_url">;

type AuthContextValue = {
  user: User | null;
  profile: PublicProfile | null;
  onlineUsers: OnlineUser[];
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const WARNING_AFTER_MS = 60 * 60 * 1000;
const SIGN_OUT_AFTER_WARNING_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [warningDeadline, setWarningDeadline] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const signOut = useCallback(async () => {
    if (user) localStorage.removeItem(`knitalong-last-activity:${user.id}`);
    setWarningDeadline(null);
    await supabase.auth.signOut({ scope: "local" });
    setUser(null);
    setProfile(null);
    setOnlineUsers([]);
  }, [user]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (active) {
          setUser(session?.user ?? null);
          if (!session) {
            setProfile(null);
            setOnlineUsers([]);
            setWarningDeadline(null);
          }
          setLoading(false);
        }
      }, 0);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("id, display_name, avatar_url, role, experience_level").eq("id", user.id).maybeSingle();
    if (data) setProfile(data as PublicProfile);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const userId = user.id;
    async function loadPublicProfile() {
      const { data } = await supabase.from("profiles").select("id, display_name, avatar_url, role, experience_level").eq("id", userId).maybeSingle();
      if (active && data) setProfile(data as PublicProfile);
    }
    void loadPublicProfile();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user || !profile || profile.id !== user.id) return;
    let active = true;
    const tabId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const channel = supabase.channel("knitalong-online", { config: { presence: { key: `${user.id}:${tabId}` } } });

    const updateOnlineUsers = () => {
      const state = channel.presenceState<{ userId: string; displayName: string; avatarUrl: string | null }>();
      const unique = new Map<string, OnlineUser>();
      Object.values(state).flat().forEach((entry) => {
        if (entry.userId && !unique.has(entry.userId)) unique.set(entry.userId, { id: entry.userId, display_name: entry.displayName, avatar_url: entry.avatarUrl });
      });
      if (active) setOnlineUsers([...unique.values()]);
    };

    channel.on("presence", { event: "sync" }, updateOnlineUsers).on("presence", { event: "join" }, updateOnlineUsers).on("presence", { event: "leave" }, updateOnlineUsers).subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId: user.id, displayName: profile.display_name, avatarUrl: profile.avatar_url });
      }
    });

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [user, profile]);

  useEffect(() => {
    if (!user) return;
    const key = `knitalong-last-activity:${user.id}`;
    const readLastActivity = () => {
      const stored = Number(localStorage.getItem(key));
      return Number.isFinite(stored) && stored > 0 ? stored : Date.now();
    };
    if (!localStorage.getItem(key)) localStorage.setItem(key, String(Date.now()));

    let lastActivityWrite = readLastActivity();
    const recordActivity = () => {
      const now = Date.now();
      if (warningDeadline === null && now - lastActivityWrite >= 30_000) {
        lastActivityWrite = now;
        localStorage.setItem(key, String(now));
      }
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"];
    events.forEach((eventName) => window.addEventListener(eventName, recordActivity, { passive: true }));

    const timer = window.setInterval(() => {
      const now = Date.now();
      if (warningDeadline !== null) {
        const remaining = Math.max(0, Math.ceil((warningDeadline - now) / 1000));
        setSecondsLeft(remaining);
        if (remaining === 0) void signOut();
      } else if (now - readLastActivity() >= WARNING_AFTER_MS) {
        setWarningDeadline(now + SIGN_OUT_AFTER_WARNING_MS);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
      events.forEach((eventName) => window.removeEventListener(eventName, recordActivity));
    };
  }, [user, warningDeadline, signOut]);

  const continueSession = () => {
    if (user) localStorage.setItem(`knitalong-last-activity:${user.id}`, String(Date.now()));
    setWarningDeadline(null);
  };

  const value = useMemo(() => ({ user, profile, onlineUsers, loading, signOut, refreshProfile }), [user, profile, onlineUsers, loading, signOut, refreshProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {warningDeadline !== null && <div className="session-warning-backdrop" role="presentation"><section className="session-warning" role="alertdialog" aria-modal="true" aria-labelledby="session-warning-title"><p className="eyebrow">Noch da?</p><h2 id="session-warning-title">Bist du noch dabei?</h2><p>Aus Datenschutzgründen wirst du in {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} Minuten abgemeldet.</p><button className="button button-dark" type="button" onClick={continueSession}>Weiter eingeloggt bleiben</button><button className="text-button" type="button" onClick={() => void signOut()}>Jetzt abmelden</button></section></div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden.");
  return context;
}
