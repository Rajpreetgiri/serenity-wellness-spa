"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { userApi } from "@/lib/api-client";

const schema = z
  .object({
    current: z.string().min(1, "Current password required"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setApiError("");
    try {
      await userApi.changePassword({ currentPassword: data.current, newPassword: data.password });
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to change password. Please try again.");
    }
  };

  const toggle = (field: keyof typeof show) =>
    setShow((p) => ({ ...p, [field]: !p[field] }));

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20
                      flex items-center justify-center px-4 py-16 sm:py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-spa-accent rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-green"
          >
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
          </motion.div>
          <h2
            className="font-heading text-spa-text mb-3"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}
          >
            Password updated
          </h2>
          <p className="font-body text-spa-muted text-sm mb-7 sm:mb-8">
            Your password has been changed successfully.
          </p>
          <Link href="/dashboard" className="btn-primary inline-block">
            Back to dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20
                    flex items-center justify-center px-4 py-14 sm:py-20">
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
              Change password
            </h1>
            <p className="font-body text-xs sm:text-sm text-spa-muted">Keep your account secure</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {[
              { name: "current" as const, label: "Current password", key: "current" as const },
              { name: "password" as const, label: "New password", key: "new" as const },
              { name: "confirm" as const, label: "Confirm new password", key: "confirm" as const },
            ].map(({ name, label, key }) => (
              <div key={name}>
                <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5 sm:mb-2">
                  {label}
                </label>
                <div className="relative">
                  <input
                    {...register(name)}
                    type={show[key] ? "text" : "password"}
                    placeholder="••••••••"
                    className="input-soft pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-spa-muted p-0.5"
                  >
                    {show[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors[name] && (
                  <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}

            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="font-body text-xs text-red-600">{apiError}</p>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5 mt-1"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Updating...
                </>
              ) : "Update password"}
            </motion.button>
          </form>

          <Link
            href="/dashboard"
            className="font-body text-xs sm:text-sm text-spa-muted hover:text-spa-accent
                       transition-colors mt-5 sm:mt-6 block text-center"
          >
            Cancel
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
