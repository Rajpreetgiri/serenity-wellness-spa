"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Leaf, AlertCircle, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
  const strength = Object.values(passwordStrength).filter(Boolean).length;

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    setSuccess(true);
    login(data.email, data.name);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20
                      flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-spa-accent rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-green"
          >
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2} />
          </motion.div>
          <h2
            className="font-heading text-spa-text mb-3"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}
          >
            Welcome to Serenity
          </h2>
          <p className="font-body text-spa-muted text-sm">Taking you to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20
                    flex items-center justify-center px-4 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-mint-200/40 rounded-3xl sm:rounded-4xl
                        shadow-soft-lg p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-7 sm:mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
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
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem, 5vw, 2.2rem)" }}
            >
              Begin your journey
            </h1>
            <p className="font-body text-xs sm:text-sm text-spa-muted">Create your wellness account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div>
              <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">
                Full name
              </label>
              <input {...register("name")} type="text" placeholder="Alexandra Chen" className="input-soft" />
              {errors.name && (
                <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">
                Email
              </label>
              <input {...register("email")} type="email" placeholder="you@example.com" className="input-soft" />
              {errors.email && (
                <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="input-soft pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spa-muted"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-2">
                  {/* Strength bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength
                            ? strength <= 1 ? "bg-red-400"
                              : strength <= 2 ? "bg-amber-400"
                              : strength <= 3 ? "bg-spa-green"
                              : "bg-spa-accent"
                            : "bg-mint-200"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Criteria */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {Object.entries({
                      "8+ characters": passwordStrength.hasLength,
                      "Uppercase": passwordStrength.hasUpper,
                      "Lowercase": passwordStrength.hasLower,
                      "Number": passwordStrength.hasNumber,
                    }).map(([label, met]) => (
                      <div
                        key={label}
                        className={`flex items-center gap-1 font-body transition-colors ${
                          met ? "text-spa-accent" : "text-spa-muted/50"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                            met ? "bg-spa-accent border-spa-accent" : "border-mint-300"
                          }`}
                        >
                          {met && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[9px] sm:text-[10px]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">
                Confirm password
              </label>
              <input {...register("confirm")} type="password" placeholder="••••••••" className="input-soft" />
              {errors.confirm && (
                <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.confirm.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 mt-1"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating account...
                </>
              ) : "Create account"}
            </motion.button>
          </form>

          <div className="relative my-5 sm:my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-mint-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/70 px-3 font-body text-[10px] sm:text-xs text-spa-muted">
                Already have an account?
              </span>
            </div>
          </div>

          <Link href="/login" className="w-full btn-secondary text-center block !py-3">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
