"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGeneratorStore } from "@/store/useGeneratorStore";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const router = useRouter();
  const { reset } = useGeneratorStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Detect auth state client-side
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setUserMenuOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [userMenuOpen]);

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const displayEmail = user?.email ?? "";
  const shortEmail = displayEmail.length > 22 ? displayEmail.slice(0, 20) + "…" : displayEmail;
  const initial = displayEmail[0]?.toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => { reset(); closeMenu(); }}
          className="flex items-center flex-shrink-0"
        >
          <span className="text-2xl font-bold text-foreground tracking-tight">
            Vox<span className="text-accent">stel</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted">
          <Link href="/#fonctionnalites" className="hover:text-foreground transition-colors">
            Fonctionnalités
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Tarifs
          </Link>
          <Link href="/bibliotheque" className="hover:text-foreground transition-colors">
            Bibliothèque
          </Link>
          <Link href="/generate" className="hover:text-foreground font-medium transition-colors">
            Générateur
          </Link>
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors px-3 py-2 rounded-xl hover:bg-card-hover"
              >
                <span className="w-7 h-7 bg-accent/15 text-accent rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {initial}
                </span>
                <span className="max-w-[160px] truncate text-foreground">{shortEmail}</span>
                <svg
                  className={`w-3.5 h-3.5 text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-card-hover transition-colors"
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <div className="border-t border-border" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span>↩</span> Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-white bg-accent hover:bg-accent-dark px-4 py-2 rounded-xl transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-card-hover transition-colors"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menuOpen ? (
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          <Link href="/#fonctionnalites" onClick={closeMenu} className="block text-sm text-muted hover:text-foreground py-2.5 px-2 rounded-lg hover:bg-card-hover transition-colors">
            Fonctionnalités
          </Link>
          <Link href="/pricing" onClick={closeMenu} className="block text-sm text-muted hover:text-foreground py-2.5 px-2 rounded-lg hover:bg-card-hover transition-colors">
            Tarifs
          </Link>
          <Link href="/bibliotheque" onClick={closeMenu} className="block text-sm text-muted hover:text-foreground py-2.5 px-2 rounded-lg hover:bg-card-hover transition-colors">
            Bibliothèque
          </Link>
          <Link href="/generate" onClick={closeMenu} className="block text-sm font-medium text-foreground py-2.5 px-2 rounded-lg hover:bg-card-hover transition-colors">
            Générateur
          </Link>

          <div className="pt-3 border-t border-border mt-2">
            {user ? (
              <div className="space-y-1">
                <p className="text-xs text-muted px-2 pt-1 pb-2 truncate">{displayEmail}</p>
                <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-2 px-2 py-2.5 text-sm text-foreground rounded-lg hover:bg-card-hover transition-colors">
                  <span>📊</span> Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-2 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <span>↩</span> Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex gap-2.5">
                <Link href="/login" onClick={closeMenu} className="flex-1 text-center py-2.5 text-sm text-muted border border-border rounded-xl hover:bg-card-hover transition-colors">
                  Connexion
                </Link>
                <Link href="/signup" onClick={closeMenu} className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-colors">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
