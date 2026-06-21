import type { Metadata } from 'next'
import { ProtectedNavbar } from "@/components/shared/ProtectedNavbar"

export const metadata: Metadata = {
  title: 'Admin | SkillSwap',
  description: 'Admin dashboard for SkillSwap Market.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProtectedNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
