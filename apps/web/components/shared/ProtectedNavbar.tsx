"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plus, User, LogOut, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/shared/ThemeToggle"
import { useAuthStore } from "@/store/auth"
import { logoutUser } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export function ProtectedNavbar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navItems = [
    { name: "Listings", href: "/listings" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Wallet", href: "/wallet" },
  ]

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            pathname.startsWith(item.href) && item.href !== '/listings' || (item.href === '/listings' && pathname === '/listings')
              ? "text-primary font-bold"
              : "text-muted-foreground"
          } ${mobile ? "block py-2 text-lg" : ""}`}
        >
          {item.name}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/75 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="text-2xl font-black tracking-tighter text-foreground">
              Skill<span className="text-primary">Swap</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          
          <div className="hidden sm:block">
            <Link href="/listings/new">
              <Button size="sm" className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 rounded-lg text-sm gap-1.5 cursor-pointer">
                <Plus className="h-4 w-4" /> Post a Skill
              </Button>
            </Link>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer p-0 overflow-hidden">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/profile/${user._id}`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin">
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutUser()} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-left font-black tracking-tighter text-2xl mb-6">
                Skill<span className="text-primary">Swap</span>
              </SheetTitle>
              <nav className="flex flex-col space-y-4">
                <NavLinks mobile />
                <Link href="/listings/new" className="pt-4">
                  <Button className="w-full font-bold bg-primary text-primary-foreground rounded-lg gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" /> Post a Skill
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
