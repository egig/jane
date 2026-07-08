"use client"

import { useState } from "react"
import { Sparkles, Check, Copy, Wand2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type GeneratedName = {
  id: string
  name: string
  style: string
}

const SUGGESTIONS = ["coffee, delivery", "fitness, tracker", "photo, share", "task, focus"]

export function NameGenerator() {
  const [keywords, setKeywords] = useState("")
  const [names, setNames] = useState<GeneratedName[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleGenerate = async () => {
    const trimmed = keywords.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    setError(null)
    setHasGenerated(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setNames([])
        setError(data?.error ?? "Something went wrong. Please try again.")
        return
      }

      const withIds: GeneratedName[] = (data.names ?? []).map(
        (n: { name: string; style: string }, i: number) => ({
          id: `${Date.now()}-${i}`,
          name: n.name,
          style: n.style,
        }),
      )
      setNames(withIds)
    } catch {
      setNames([])
      setError("Could not reach the server. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
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
            disabled={!keywords.trim() || isLoading}
            className="h-12 gap-2 px-6 text-base font-medium"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Wand2 className="size-5" aria-hidden="true" />
            )}
            {isLoading ? "Generating" : "Generate"}
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
          {isLoading ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="h-[68px] animate-pulse rounded-xl border border-border bg-secondary"
                />
              ))}
            </ul>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
              <div>
                <p className="font-medium">Couldn&apos;t generate names</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : names.length > 0 ? (
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
          ) : null}
        </div>
      )}
    </section>
  )
}
