"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Field, 
  FieldContent, 
  FieldDescription, 
  FieldError, 
  FieldLabel,
  FieldGroup
} from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { registerUser } from "@/lib/auth"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
    // cast to any to avoid zod version mismatch type errors with @hookform/resolvers
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
      setError(err.response?.data?.message || "Registration failed. Please try again.")
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
          Join the Market
        </span>
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-2 text-foreground">
        CREATE ACCOUNT
      </h1>
      <p className="text-muted-foreground font-medium mb-8">
        Start bartering your expertise and earning Skill Credits today.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Jane Doe"
                {...register("name")}
                className="rounded-xl border-input bg-background focus-visible:ring-primary/20"
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
                {...register("email")}
                className="rounded-xl border-input bg-background focus-visible:ring-primary/20"
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
                {...register("password")}
                className="rounded-xl border-input bg-background focus-visible:ring-primary/20"
              />
              <FieldError errors={[errors.password]} />
              <FieldDescription>At least 6 characters long.</FieldDescription>
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
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm font-medium text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
