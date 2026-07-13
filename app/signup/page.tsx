"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { fbTrack } from "@/lib/fbq";
import { gtagTrackConversion, GOOGLE_ADS_CONVERSION } from "@/lib/gtag";
import { captureGA4ClientId } from "@/lib/utm.client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 13 4 24s8.9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  );
}

function translateAuthError(msg: string): string {
  if (msg.includes("already registered") || msg.includes("User already registered"))
    return "Un compte existe déjà avec cet email. Connectez-vous.";
  if (msg.includes("Password should be")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (msg.includes("Too many requests")) return "Trop de tentatives. Réessayez dans quelques minutes.";
  return "Une erreur est survenue. Veuillez réessayer.";
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(next);
    });
  }, [router, next]);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    captureGA4ClientId();

    const supabase = createBrowserSupabaseClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (authError) {
      setError(translateAuthError(authError.message));
      setLoading(false);
      return;
    }

    fbTrack("CompleteRegistration");
    gtagTrackConversion(GOOGLE_ADS_CONVERSION.signup);

    if (data.session) {
      // Session immédiate (ex: OAuth ou confirmation désactivée côté Supabase)
      router.push(next);
      router.refresh();
    } else {
      // Email confirmation enabled — Supabase renvoie session: null
      setSuccess(true);
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    setError(null);
    captureGA4ClientId();
    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (authError) {
      setError("Impossible de lancer l'inscription avec Google. Réessayez.");
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ backgroundColor: "rgba(200,145,10,0.10)" }}
          >
            📬
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Vérifiez votre boîte mail
          </h2>
          <p className="text-muted mb-2 leading-relaxed">
            Un email de confirmation a été envoyé à{" "}
            <span className="text-foreground font-semibold">{email}</span>.
          </p>
          <p className="text-muted mb-8 leading-relaxed">
            Cliquez sur le lien pour activer votre compte.
          </p>
          <p className="text-xs text-muted/60 mb-8">
            Pas de mail ? Vérifiez vos spams ou courriers indésirables.
          </p>
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn-secondary inline-flex items-center gap-2">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold text-foreground">
              Vox<span className="text-accent">stel</span>
            </span>
          </Link>
          <p className="text-muted mt-2 text-sm">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-foreground mb-6">Créer un compte</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="btn-secondary w-full flex items-center justify-center gap-3 mb-5"
          >
            <GoogleIcon />
            {googleLoading ? "Redirection…" : "Continuer avec Google"}
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email / password */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input-field"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Mot de passe{" "}
                <span className="text-muted font-normal">(min. 6 caractères)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-field pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création…
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Déjà un compte ?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-accent font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
