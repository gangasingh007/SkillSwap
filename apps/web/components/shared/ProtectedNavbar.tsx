"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plus, User, LogOut, ShieldAlert, LayoutDashboard, Search, List, Wallet, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/shared/ThemeToggle"
import { useAuthStore } from "@/store/auth"
import { logoutUser } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet"

export function ProtectedNavbar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navItems = [
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Listings", href: "/listings", icon: List },
    { name: "Orders", href: "/orders", icon: Sparkles },
    { name: "Wallet", href: "/wallet", icon: Wallet },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-8 mx-auto justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-2xl sm:inline-block">
              Skill<span className="text-primary">Swap</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/explore' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <Link href="/listings/new">
              <Button size="sm" className="h-8 rounded-2xl text-background gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Post a Skill</span>
              </Button>
            </Link>
          </div>
          <ModeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user._id}`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutUser()} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden h-8 w-8 px-0" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left">
                <SheetTitle>
                  Skill<span className="text-primary">Swap</span>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation Menu
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/explore' && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              <div className="px-3">
                <Link href="/listings/new">
                  <Button className="w-full gap-2 justify-start" variant="default">
                    <Plus className="h-4 w-4" /> Post a Skill
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
