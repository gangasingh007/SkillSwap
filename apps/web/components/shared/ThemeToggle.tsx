"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * ThemeToggle component provides a polished UI for switching between
 * light, dark, and system color themes with smooth Framer Motion animations.
 */
export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering icons after mount
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="h-9 w-9 opacity-50">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative h-9 w-9 overflow-hidden rounded-md border-border bg-background transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            {resolvedTheme === "dark" ? (
              <motion.div
                key="dark-icon"
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="flex items-center justify-center"
              >
                <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="light-icon"
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="flex items-center justify-center"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 p-1 border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <span className="text-sm font-medium">Light</span>
          </div>
          {theme === "light" && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            <span className="text-sm font-medium">Dark</span>
          </div>
          {theme === "dark" && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="text-sm font-medium">System</span>
          </div>
          {theme === "system" && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
