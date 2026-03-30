"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";
import { validateLogin, DEMO_USER } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    if (validateLogin(data.email, data.password)) {
      login(data.email, DEMO_USER.name);
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Use demo@wellness.com / 123456");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20
                    flex items-center justify-center px-4 py-16 sm:py-20">
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="fixed top-20 right-0 sm:right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72
                   rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-mint-200/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], x: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, delay: 3 }}
        className="fixed bottom-20 left-0 sm:left-10 w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64
                   rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-peach-200/15 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-mint-200/40 rounded-3xl sm:rounded-4xl
                        shadow-soft-lg p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-7 sm:mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group mb-6 sm:mb-8">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-spa-accent rounded-xl sm:rounded-2xl flex items-center justify-center shadow-green">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
              </div>
              <span
                className="font-heading text-lg sm:text-xl text-spa-text"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Serenity
              </span>
            </Link>

            <h1
              className="font-heading text-spa-text mb-2"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              }}
            >
              Welcome back
            </h1>
            <p className="font-body text-xs sm:text-sm text-spa-muted">
              Continue your wellness journey
            </p>
          </div>

          {/* Demo hint */}
          <div className="bg-mint-100/60 border border-spa-green/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-6 sm:mb-7 flex gap-2.5 sm:gap-3">
            <span className="text-base sm:text-lg flex-shrink-0">🌿</span>
            <div>
              <p className="font-body text-[10px] sm:text-xs font-medium text-spa-accent mb-0.5">Demo credentials</p>
              <p className="font-body text-[10px] sm:text-xs text-spa-muted">
                Email: demo@wellness.com<br />Password: 123456
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div>
              <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="input-soft"
                autoComplete="email"
              />
              {errors.email && (
                <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-body text-[10px] sm:text-xs text-spa-accent hover:text-spa-text transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-soft pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spa-muted hover:text-spa-text transition-colors p-0.5"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                    : <Eye className="w-4 h-4" strokeWidth={1.5} />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start"
              >
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="font-body text-xs text-red-600">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 mt-1"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in...
                </>
              ) : "Sign in"}
            </motion.button>
          </form>

          <div className="relative my-5 sm:my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-mint-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/70 px-3 font-body text-[10px] sm:text-xs text-spa-muted">
                New to Serenity?
              </span>
            </div>
          </div>

          <Link href="/signup" className="w-full btn-secondary text-center block !py-3">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
