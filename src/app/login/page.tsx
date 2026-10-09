"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Compte créé avec succès ! Tu peux maintenant te connecter.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-slate-500 font-medium">Vérification de la session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isLogin ? "Bon retour ! 👋" : "Créer un compte 🚀"}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            {isLogin
              ? "Connecte-toi pour accéder à ton tableau de bord."
              : "Crée ton compte administrateur sécurisé."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-slate-50 border-transparent rounded-xl focus:bg-white transition-all text-slate-900 font-medium"
                placeholder="nom@exemple.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 h-12 bg-slate-50 border-transparent rounded-xl focus:bg-white transition-all text-slate-900 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-[15px] shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {isLogin
              ? "Tu n'as pas encore de compte ? S'inscrire"
              : "Tu as déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
