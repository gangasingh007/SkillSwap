"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, ShieldCheck, Sparkles, TrendingUp } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Branding & Value Prop (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-muted/20 border-r border-border/30 p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 h-[500px] w-[500px] bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-primary/10 blur-[100px]" />
        </div>

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">SkillSwap</span>
          <span className="ml-1 rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary">
            MARKET
          </span>
        </Link>

        <div className="max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-5xl font-black tracking-tighter leading-[0.95] mb-8 uppercase">
              WELCOME BACK <br />
              TO THE <span className="text-primary italic">MARKET.</span>
            </h2>
            
            <div className="space-y-8">
              {[
                { 
                  title: "Resume Swapping", 
                  desc: "Connect with your active trade partners instantly.", 
                  icon: TrendingUp 
                },
                { 
                  title: "Manage Your Wallet", 
                  desc: "Check your Skill Credits and USD balance in real-time.", 
                  icon: Sparkles 
                },
                { 
                  title: "Stay Protected", 
                  desc: "All active trades are held in our secure escrow system.", 
                  icon: ShieldCheck 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group text-foreground">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-background border border-border/60 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
                    <p className="text-muted-foreground text-sm font-medium mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 relative z-10">
          © 2026 SKILLSWAP MARKET INC. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="lg:hidden absolute top-8 left-8">
           <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight">SkillSwap</span>
          </Link>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}
