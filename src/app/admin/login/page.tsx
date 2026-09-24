"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Email atau password tidak valid.");
      setLoading(false);
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.push(nextPath?.startsWith("/admin") ? nextPath : "/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="admin-auth">
      <div className="admin-auth__grid" aria-hidden="true" />
      <div className="admin-auth__card">
        <Link className="admin-auth__brand" href="/">
          <span>EB</span>
          <strong>EKABEKTI / SYSTEMS</strong>
        </Link>
        <div className="admin-auth__heading">
          <span className="mono-label">Private workspace / 01</span>
          <h1>Welcome back, Ekabekti.</h1>
          <p>Masuk untuk mengelola konten portofolio dan pesan yang masuk.</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@domain.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="admin-form__error" role="alert">{error}</p>}
          <button className="button button--primary admin-form__submit" type="submit" disabled={loading}>
            <span>{loading ? "Memeriksa…" : "Masuk ke dashboard"}</span>
            <span className="button__arrow" aria-hidden="true">↗</span>
          </button>
        </form>
        <Link className="admin-auth__back" href="/">← Kembali ke landing page</Link>
      </div>
    </main>
  );
}
