"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Leaf, AlertCircle, Check, Mail } from "lucide-react";
import { authApi } from "@/lib/api-client";
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
  const [stage, setStage] = useState<"register" | "otp" | "success">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredPassword, setRegisteredPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    setApiError("");
    try {
      await authApi.register({ name: data.name, email: data.email, password: data.password });
      setRegisteredEmail(data.email);
      setRegisteredPassword(data.password);
      setStage("otp");
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Please enter all 6 digits"); return; }
    setOtpLoading(true);
    setOtpError("");
    try {
      await authApi.verifyOtp({ email: registeredEmail, otp: code });
      // Auto-login after verification
      await login(registeredEmail, registeredPassword);
      setStage("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authApi.resendOtp(registeredEmail);
    } catch {
      // ignore
    } finally {
      setResendLoading(false);
    }
  };

  if (stage === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20 flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-spa-accent rounded-full flex items-center justify-center mx-auto mb-5 shadow-green"
          >
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2} />
          </motion.div>
          <h2 className="font-heading text-spa-text mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>
            Welcome to Serenity
          </h2>
          <p className="font-body text-spa-muted text-sm">Taking you to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20 flex items-center justify-center px-4 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-mint-200/40 rounded-3xl sm:rounded-4xl shadow-soft-lg p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-7 sm:mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-spa-accent rounded-xl sm:rounded-2xl flex items-center justify-center shadow-green">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-heading text-lg sm:text-xl text-spa-text" style={{ fontFamily: "var(--font-cormorant)" }}>Serenity</span>
            </Link>
            <AnimatePresence mode="wait">
              {stage === "register" ? (
                <motion.div key="reg-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h1 className="font-heading text-spa-text mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem, 5vw, 2.2rem)" }}>
                    Begin your journey
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-spa-muted">Create your wellness account</p>
                </motion.div>
              ) : (
                <motion.div key="otp-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-14 h-14 bg-mint-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-spa-accent" strokeWidth={1.5} />
                  </div>
                  <h1 className="font-heading text-spa-text mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem, 5vw, 2.2rem)" }}>
                    Check your email
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-spa-muted">
                    We sent a 6-digit code to<br />
                    <span className="text-spa-accent font-medium">{registeredEmail}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {stage === "register" ? (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                <div>
                  <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">Full name</label>
                  <input {...register("name")} type="text" placeholder="Alexandra Chen" className="input-soft" />
                  {errors.name && <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                </div>

                <div>
                  <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">Email</label>
                  <input {...register("email")} type="email" placeholder="you@example.com" className="input-soft" />
                  {errors.email && <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
                </div>

                <div>
                  <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">Password</label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="input-soft pr-11"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spa-muted">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strength <= 1 ? "bg-red-400" : strength <= 2 ? "bg-amber-400" : strength <= 3 ? "bg-spa-green" : "bg-spa-accent" : "bg-mint-200"}`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {Object.entries({ "8+ characters": passwordStrength.hasLength, "Uppercase": passwordStrength.hasUpper, "Lowercase": passwordStrength.hasLower, "Number": passwordStrength.hasNumber }).map(([label, met]) => (
                          <div key={label} className={`flex items-center gap-1 font-body transition-colors ${met ? "text-spa-accent" : "text-spa-muted/50"}`}>
                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${met ? "bg-spa-accent border-spa-accent" : "border-mint-300"}`}>
                              {met && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-[9px] sm:text-[10px]">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
                </div>

                <div>
                  <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">Confirm password</label>
                  <input {...register("confirm")} type="password" placeholder="••••••••" className="input-soft" />
                  {errors.confirm && <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confirm.message}</p>}
                </div>

                {apiError && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-red-600">{apiError}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 mt-1"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Creating account...
                    </>
                  ) : "Create account"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                {/* OTP inputs */}
                <div className="flex gap-2 sm:gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold font-body text-spa-text
                                 border-2 border-mint-200 rounded-xl focus:outline-none focus:border-spa-accent
                                 bg-white/80 transition-colors"
                    />
                  ))}
                </div>

                {otpError && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-red-600">{otpError}</p>
                  </motion.div>
                )}

                <motion.button
                  onClick={handleVerifyOtp}
                  disabled={otpLoading || otp.join("").length < 6}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50"
                >
                  {otpLoading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Verifying...
                    </>
                  ) : "Verify & Continue"}
                </motion.button>

                <p className="text-center font-body text-xs text-spa-muted">
                  Didn&apos;t receive it?{" "}
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-spa-accent font-medium hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend code"}
                  </button>
                </p>

                <button
                  onClick={() => setStage("register")}
                  className="w-full text-center font-body text-xs text-spa-muted hover:text-spa-text transition-colors"
                >
                  ← Back to registration
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {stage === "register" && (
            <>
              <div className="relative my-5 sm:my-7">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-mint-200" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-white/70 px-3 font-body text-[10px] sm:text-xs text-spa-muted">Already have an account?</span>
                </div>
              </div>
              <Link href="/login" className="w-full btn-secondary text-center block !py-3">Sign in</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
