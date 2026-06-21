import type { Metadata } from 'next'
import { ProtectedNavbar } from "@/components/shared/ProtectedNavbar"

export const metadata: Metadata = {
  title: 'Dashboard | SkillSwap',
  description: 'Manage your SkillSwap activities, orders, and wallet.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProtectedNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
