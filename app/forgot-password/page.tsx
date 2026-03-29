"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, AlertCircle, Mail, ArrowLeft, CheckCircle } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmittedEmail(data.email);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/20 flex items-center justify-center px-4 py-20">
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="fixed top-20 right-10 w-72 h-72 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-mint-200/20 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-mint-200/40 rounded-4xl shadow-soft-lg p-10">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-spa-accent rounded-2xl flex items-center justify-center shadow-green">
                <Leaf className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <span
                className="font-heading text-xl text-spa-text"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Serenity
              </span>
            </Link>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-16 h-16 bg-mint-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Mail className="w-8 h-8 text-spa-accent" strokeWidth={1.5} />
                  </div>
                  <h1
                    className="font-heading text-spa-text mb-2"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem" }}
                  >
                    Forgot password?
                  </h1>
                  <p className="font-body text-sm text-spa-muted">
                    No worries — we&apos;ll send you reset instructions.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-spa-accent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-green"
                  >
                    <CheckCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </motion.div>
                  <h1
                    className="font-heading text-spa-text mb-2"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem" }}
                  >
                    Check your inbox
                  </h1>
                  <p className="font-body text-sm text-spa-muted text-center">
                    We&apos;ve sent a reset link to{" "}
                    <span className="font-medium text-spa-accent">{submittedEmail}</span>
                  </p>
                  <p className="font-body text-xs text-spa-muted/70 mt-3 text-center">
                    Didn&apos;t receive it? Check your spam folder or try again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div>
                  <label className="font-body text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-2">
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="input-soft"
                  />
                  {errors.email && (
                    <p className="font-body text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send reset instructions"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <Link href="/login" className="w-full btn-primary text-center block">
                  Back to sign in
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-body text-sm text-spa-muted hover:text-spa-accent transition-colors mt-6 mx-auto w-full justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
