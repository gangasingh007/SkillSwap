"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Field, 
  FieldContent, 
  FieldError, 
  FieldLabel,
  FieldGroup
} from "@/components/ui/field"
import { loginUser } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
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
      setError(err.response?.data?.message || "Invalid email or password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[400px]"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-primary" />
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
          Welcome Back
        </span>
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-2 text-foreground">
        LOG IN
      </h1>
      <p className="text-muted-foreground font-medium mb-8">
        Access your SkillSwap dashboard and manage your trades.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                {...register("email")}
                className="rounded-xl border-input bg-background focus-visible:ring-primary/20"
              />
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link href="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">
                Forgot?
              </Link>
            </div>
            <FieldContent>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="rounded-xl border-input bg-background focus-visible:ring-primary/20"
              />
              <FieldError errors={[errors.password]} />
            </FieldContent>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-bold uppercase tracking-widest gap-2"
          disabled={isLoading}
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

        <p className="text-center text-sm font-medium text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
