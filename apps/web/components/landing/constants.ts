import { 
  Code2, 
  Palette, 
  Megaphone, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Star 
} from "lucide-react"

export const TICKER_ITEMS = [
  "React Development",
  "Brand Identity",
  "SEO Audit",
  "Copywriting",
  "Financial Modeling",
  "Motion Design",
  "Data Analysis",
  "UX Research",
  "Mobile Dev",
  "3D Animation",
  "Content Strategy",
  "Growth Hacking",
  "Product Design",
  "SQL Optimization",
  "Video Editing",
  "Pitch Decks",
]

export const LIVE_SWAPS = [
  { from: "A. Chen", skill: "designed a logo system", for: "M. Patel", time: "2m ago", credits: 4 },
  { from: "S. Okonkwo", skill: "built a REST API", for: "T. Larsson", time: "7m ago", credits: 6 },
  { from: "R. Gupta", skill: "wrote 5 blog posts", for: "J. Mello", time: "14m ago", credits: 3 },
  { from: "K. Nakamura", skill: "ran a paid ad audit", for: "A. Osei", time: "19m ago", credits: 5 },
  { from: "L. Torres", skill: "recorded a voiceover", for: "C. Park", time: "23m ago", credits: 2 },
]

export const STATS = [
  { value: "12,400+", label: "Verified Experts", icon: Users },
  { value: "$2.4M", label: "Value Exchanged", icon: TrendingUp },
  { value: "98%", label: "Completion Rate", icon: CheckCircle2 },
  { value: "4.9", label: "Avg. Rating", icon: Star },
]

export const CATEGORIES = [
  { name: "Development", icon: Code2, tag: "2,840 experts" },
  { name: "Design", icon: Palette, tag: "1,920 experts" },
  { name: "Marketing", icon: Megaphone, tag: "1,450 experts" },
  { name: "Writing", icon: PenTool, tag: "980 experts" },
  { name: "Business", icon: Briefcase, tag: "1,210 experts" },
  { name: "Education", icon: GraduationCap, tag: "760 experts" },
]

export const TESTIMONIALS = [
  {
    quote: "Landed a $12k website project in exchange for three brand consultations. The credit economy is genuinely brilliant.",
    author: "Priya S.",
    role: "Brand Strategist, Delhi",
    rating: 5,
  },
  {
    quote: "I'd spent months trying to find a React dev on Upwork. Found one here in 48 hours — paid entirely in credits from my own design work.",
    author: "Marcus T.",
    role: "Product Designer, Lagos",
    rating: 5,
  },
  {
    quote: "SkillSwap changed how I think about the value of my time. Every consulting call now compounds into future work.",
    author: "Ji-ho K.",
    role: "Growth Consultant, Seoul",
    rating: 5,
  },
]
