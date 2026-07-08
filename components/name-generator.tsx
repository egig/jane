"use client"

import { useState } from "react"
import { Sparkles, Check, Copy, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateNames, type GeneratedName } from "@/lib/name-generator"

const SUGGESTIONS = ["coffee, delivery", "fitness, tracker", "photo, share", "task, focus"]

export function NameGenerator() {
  const [keywords, setKeywords] = useState("")
  const [names, setNames] = useState<GeneratedName[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!keywords.trim()) return
    setNames(generateNames(keywords, 12))
    setHasGenerated(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleCopy = async (name: GeneratedName) => {
    try {
      await navigator.clipboard.writeText(name.name)
      setCopiedId(name.id)
      setTimeout(() => setCopiedId((c) => (c === name.id ? null : c)), 1500)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <label htmlFor="keywords" className="mb-2 block text-sm font-medium text-foreground">
          Describe your app with a few keywords
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. coffee, delivery, fast"
            className="h-12 flex-1 rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="App keywords"
          />
          <Button
            onClick={handleGenerate}
            disabled={!keywords.trim()}
            className="h-12 gap-2 px-6 text-base font-medium"
          >
            <Wand2 className="size-5" aria-hidden="true" />
            Generate
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setKeywords(s)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {hasGenerated && (
        <div className="mt-8">
          {names.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {names.length} ideas for you
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  Regenerate
                </Button>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {names.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleCopy(n)}
                      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left transition-colors hover:border-primary hover:bg-secondary"
                    >
                      <span className="flex flex-col">
                        <span className="font-serif text-lg font-semibold text-foreground">
                          {n.name}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {n.style}
                        </span>
                      </span>
                      <span
                        className="text-muted-foreground transition-colors group-hover:text-primary"
                        aria-hidden="true"
                      >
                        {copiedId === n.id ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </span>
                      <span className="sr-only">Copy {n.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Enter at least one keyword with 2 or more letters to get started.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
