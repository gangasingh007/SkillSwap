import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Profile | SkillSwap',
  description: 'View user profile, listings, and reputation.',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
