"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Loader2, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-12 py-10 sm:px-20 sm:py-12 relative overflow-hidden">
      {/* Blob dekoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#2e3a8c] flex items-center justify-center shadow-lg shadow-[#2e3a8c]/30">
            <Coffee size={30} className="text-white" />
          </div>
        </div>

        {/* Judul */}
        <h1 className="font-heading text-2xl font-bold text-foreground text-center mb-2">
          Masuk ke Akun
        </h1>
        <p className="text-sm text-muted text-center mb-8">
          Selamat datang kembali
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-xl px-3 py-2.5 text-sm text-center">
              {error}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-border 
              bg-surface/80 backdrop-blur text-foreground
              placeholder:text-muted
              focus:outline-none focus:ring-2 focus:ring-[#2e3a8c]/40 focus:border-[#2e3a8c]
              transition-all text-sm"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 pr-11 py-3 rounded-xl border border-border 
                bg-surface/80 backdrop-blur text-foreground
                placeholder:text-muted
                focus:outline-none focus:ring-2 focus:ring-[#2e3a8c]/40 focus:border-[#2e3a8c]
                transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#2e3a8c] transition-colors"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e3a8c] hover:bg-[#24307a] text-white py-3 rounded-xl font-semibold text-sm
              shadow-md shadow-[#2e3a8c]/30 flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed 
              transition-all active:scale-[0.98] mt-4"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-8">
          © {new Date().getFullYear()} Kasir Kafe
        </p>
      </div>
    </div>
  );
}
