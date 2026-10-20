"use client";

import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export default function OnlineMembers() {
  const { onlineUsers, profile } = useAuth();
  const members = onlineUsers.length ? onlineUsers : profile ? [{ id: profile.id, display_name: profile.display_name, avatar_url: profile.avatar_url }] : [];

  return (
    <div className="online-members" aria-live="polite">
      <div className="avatar-stack" aria-label={`${members.length} Mitglieder gerade online`}>
        {members.slice(0, 12).map((member, index) => {
          const avatarUrl = member.avatar_url ? supabase.storage.from("avatars").getPublicUrl(member.avatar_url).data.publicUrl : null;
          return <span className={`avatar avatar-${(index % 4) + 1}`} key={member.id} title={member.display_name}>{avatarUrl ? <Image src={avatarUrl} alt="" width={30} height={30} unoptimized /> : member.display_name.slice(0, 2).toUpperCase()}</span>;
        })}
      </div>
      <p><strong>{members.length ? `${members.length} ${members.length === 1 ? "Mitglied" : "Mitglieder"} online` : "Noch niemand online"}</strong> · Eine ruhige Ecke im Internet.</p>
      <span className="proof-mark">16+</span>
    </div>
  );
}
