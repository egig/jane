import { Sparkles } from "lucide-react"
import { NameGenerator } from "@/components/name-generator"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="flex-1 bg-background px-4 py-16 sm:py-24">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          JANE · Just Another Naming Engine
        </div>
        <h1 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Give your agent a name like JARVIS
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance leading-relaxed text-muted-foreground">
          Describe your idea and JANE invents human-sounding acronym names —
          each one spelling out a phrase. Tap any name to copy it.
        </p>
      </header>

      <NameGenerator />
    </main>
  )
}
