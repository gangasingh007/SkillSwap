"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field"
import { loginUser } from "@/lib/auth"
import { OAuthButtons } from "@/components/auth/OAuthButtons"

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    // cast to any to avoid zod version mismatch type errors with @hookform/resolvers
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginValues) => {
    try {
      setIsLoading(true)
      setError(null)
      await loginUser(data)
      router.push("/dashboard")
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px]"
    >
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 bg-primary" />
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
          Welcome Back
        </span>
      </div>

      <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">
        LOG IN
      </h1>
      <p className="text-muted-foreground font-medium mb-8">
        Access your SkillSwap dashboard and manage your trades.
      </p>

      {/* ----------------------------------------------------------------- */}
      {/* Error Alert                                                       */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold px-4 py-3 rounded-xl mb-6"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------- */}
      {/* Form                                                              */}
      {/* ----------------------------------------------------------------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup>
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
                className="rounded-xl border-input bg-background h-11 transition-colors focus-visible:ring-primary/20 focus-visible:border-primary/40"
              />
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          {/* Password */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary hover:underline transition-colors duration-150 cursor-pointer"
              >
                Forgot?
              </Link>
            </div>
            <FieldContent>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
                className="rounded-xl border-input bg-background h-11 transition-colors focus-visible:ring-primary/20 focus-visible:border-primary/40"
              />
              <FieldError errors={[errors.password]} />
            </FieldContent>
          </Field>
        </FieldGroup>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 cursor-pointer transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* ----------------------------------------------------------------- */}
        {/* OAuth                                                             */}
        {/* ----------------------------------------------------------------- */}
        <OAuthButtons mode="login" />

        {/* ----------------------------------------------------------------- */}
        {/* Footer                                                            */}
        {/* ----------------------------------------------------------------- */}
        <p className="text-center text-sm font-medium text-muted-foreground pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-bold transition-colors duration-150 cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
