import { ProtectedNavbar } from "@/components/shared/ProtectedNavbar";

export default function NewListingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProtectedNavbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-10 pb-16">
        <h1 className="text-3xl font-black tracking-tighter text-foreground mb-4">Post a Skill</h1>
        {/* Further implementation goes here */}
      </main>
    </div>
  );
}
