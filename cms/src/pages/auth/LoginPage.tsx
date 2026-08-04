import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export function LoginPage() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("admin@bloomarone.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl md:grid-cols-2 dark:bg-slate-900">
        <div className="hidden bg-gradient-to-br from-bloomar-violet to-bloomar-navy p-10 text-white md:block">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Bloomarone</p>
          <h1 className="mt-4 text-3xl font-black">CMS Back Office</h1>
          <p className="mt-4 text-sm text-violet-100">Pilotez le site institutionnel, les paramètres et les médias depuis un seul endroit.</p>
        </div>
        <form className="p-8" onSubmit={onSubmit}>
          <h2 className="text-2xl font-bold text-bloomar-navy dark:text-white">Bon retour</h2>
          <p className="mt-1 text-sm text-slate-500">Connectez-vous à Bloomar CMS</p>
          {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          <label className="mt-6 block text-sm font-semibold text-slate-600 dark:text-slate-300">
            Email
            <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-600 dark:text-slate-300">
            Mot de passe
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn-primary mt-6 w-full" type="submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
