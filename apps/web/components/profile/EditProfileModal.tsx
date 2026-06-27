"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Pencil, Loader2, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/lib/users"
import { useAuthStore } from "@/store/auth"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().default(""),
  timezone: z.string().max(50).optional().default(""),
  skillTags: z.array(z.string()).max(10, "You can have up to 10 skill tags").optional().default([]),
}).strict()

type ProfileFormValues = z.infer<typeof profileSchema>

interface EditProfileModalProps {
  profile: any;
  onProfileUpdated: (updatedProfile: any) => void;
}

export function EditProfileModal({ profile, onProfileUpdated }: EditProfileModalProps) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [skillInput, setSkillInput] = React.useState("")
  const { setAuth } = useAuthStore()

  const form = useForm<ProfileFormValues>({
    // @ts-ignore
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      timezone: profile?.timezone || "",
      skillTags: profile?.skillTags || [],
    },
  })

  // Update form if profile changes (e.g. after save)
  React.useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        bio: profile.bio || "",
        timezone: profile.timezone || "",
        skillTags: profile.skillTags || [],
      })
    }
  }, [profile, form])

  const skillTags = form.watch("skillTags") || []

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (newSkill && skillTags.length < 10 && !skillTags.includes(newSkill)) {
        form.setValue("skillTags", [...skillTags, newSkill], { shouldValidate: true })
        setSkillInput("")
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    form.setValue("skillTags", skillTags.filter(s => s !== skillToRemove), { shouldValidate: true })
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      const updatedUser = await updateUserProfile(data)
      toast.success("Profile updated successfully")
      onProfileUpdated(updatedUser)
      
      // Update global auth store so the navbar reflects name changes
      const currentAuth = useAuthStore.getState()
      if (currentAuth.user && currentAuth.accessToken) {
        setAuth({ ...currentAuth.user, ...updatedUser }, currentAuth.accessToken)
      }
      
      setOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl cursor-pointer w-full md:w-auto">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your public profile information. This will be visible to other users.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={
          // @ts-ignore
          form.handleSubmit<ProfileFormValues>(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              {...form.register("name")} 
              placeholder="Your name" 
              className={form.formState.errors.name ? "border-destructive" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              {...form.register("bio")} 
              placeholder="Tell others about yourself..." 
              className={`resize-none h-24 ${form.formState.errors.bio ? "border-destructive" : ""}`}
            />
            {form.formState.errors.bio && (
              <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {form.watch("bio")?.length || 0}/500
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Location / Timezone</Label>
            <Input 
              id="timezone" 
              {...form.register("timezone")} 
              placeholder="e.g. San Francisco, CA (PST)" 
              className={form.formState.errors.timezone ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills ({skillTags.length}/10)</Label>
            <Input 
              id="skills" 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill and press Enter" 
              disabled={skillTags.length >= 10}
            />
            {form.formState.errors.skillTags && (
              <p className="text-xs text-destructive">{form.formState.errors.skillTags.message}</p>
            )}
            
            <div className="flex flex-wrap gap-2 pt-2">
              {skillTags.map((skill) => (
                <div key={skill} className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                  >{}
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
