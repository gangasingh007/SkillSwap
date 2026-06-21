"use client"

import * as React from "react"
import { BadgeCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitVouch } from "@/lib/users"
import { toast } from "sonner"

export function VouchButton({ userId, userName }: { userId: string; userName: string }) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [skillTag, setSkillTag] = React.useState("")
  const [message, setMessage] = React.useState("")

  const handleVouch = async () => {
    if (!skillTag.trim() || !message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    try {
      await submitVouch(userId, { skillTag, message })
      toast.success("Vouch submitted successfully!")
      setOpen(false)
      setSkillTag("")
      setMessage("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit vouch. You must have 10+ completed swaps.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl cursor-pointer">
          <BadgeCheck className="h-4 w-4" />
          Vouch for {userName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vouch for {userName}</DialogTitle>
          <DialogDescription>
            Endorse this user's specific skill. Note: You must have 10+ completed swaps to vouch.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Skill Tag
            </label>
            <Input
              placeholder="e.g. React Native, Copywriting..."
              value={skillTag}
              onChange={(e) => setSkillTag(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Vouch Message
            </label>
            <Textarea
              placeholder="Describe why you are vouching for this skill..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-lg resize-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleVouch} disabled={isLoading} className="rounded-xl cursor-pointer">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Vouch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
