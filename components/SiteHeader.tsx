"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function SiteHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="topbar" aria-label="Hauptnavigation">
      <Link className="brand" href="/" aria-label="KnitAlong Startseite"><span className="brand-mark" aria-hidden="true">K</span><span>KnitAlong</span></Link>
      <div className="nav-links"><Link href="/#raeume">Räume</Link><Link href="/#ueber">Über KnitAlong</Link>{loading ? <span className="nav-login">…</span> : user ? <button className="nav-login nav-logout" type="button" onClick={() => void signOut()}>Abmelden</button> : <Link className="nav-login" href="/anmelden">Anmelden</Link>}</div>
    </nav>
  );
}
