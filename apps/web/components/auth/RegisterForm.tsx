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
  FieldDescription,
} from "@/components/ui/field"
import { registerUser } from "@/lib/auth"
import { OAuthButtons } from "@/components/auth/OAuthButtons"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({

    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterValues) => {
    try {
      setIsLoading(true)
      setError(null)
      await registerUser(data)
      router.push("/dashboard")
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
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
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-primary" />
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
          Join the Market
        </span>
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-2 text-foreground">
        CREATE ACCOUNT
      </h1>
      <p className="text-muted-foreground font-medium mb-2">
        Start bartering your expertise and earning Skill Credits today.
      </p>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="register-error"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold px-4 py-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          {/* Full Name */}
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                {...register("name")}
                className="rounded-xl border-input bg-background h-11 transition-colors focus-visible:ring-primary/20 focus-visible:border-primary/40"
              />
              <FieldError errors={[errors.name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                {...register("email")}
                className="rounded-xl border-input bg-background h-11 transition-colors focus-visible:ring-primary/20 focus-visible:border-primary/40"
              />
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="rounded-xl border-input bg-background h-11 transition-colors focus-visible:ring-primary/20 focus-visible:border-primary/40"
              />
              <FieldDescription>
                At least 8 characters long.
              </FieldDescription>
              <FieldError errors={[errors.password]} />
            </FieldContent>
          </Field>
        </FieldGroup>

        <p className="text-xs text-muted-foreground leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary text-background font-bold uppercase tracking-widest gap-2 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <OAuthButtons mode="register" />

        <p className="text-center text-sm font-medium text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
