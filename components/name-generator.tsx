"use client"

import { useState, useRef } from "react"
import { Sparkles, Check, Copy, Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LimitationNotice, type LimitationCode } from "@/components/limitation-notice"

type GeneratedName = {
  id: string
  name: string
  style: string
}

type Mode = "generate" | "backronym"

const SUGGESTIONS = [
  "smart home assistant",
  "personal finance advisor",
  "coding copilot",
  "fitness coach",
]

export function NameGenerator() {
  const [mode, setMode] = useState<Mode>("generate")
  const [keywords, setKeywords] = useState("")
  const [targetName, setTargetName] = useState("")
  const [names, setNames] = useState<GeneratedName[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [limitation, setLimitation] = useState<{ code: LimitationCode; description?: string } | null>(null)
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const lastSubmitRef = useRef(0)

  const isBackronym = mode === "backronym"
  const canSubmit =
    keywords.trim().length > 0 && (!isBackronym || targetName.trim().length > 0) && !isLoading

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setNames([])
    setHasGenerated(false)
    setLimitation(null)
  }

  const handleGenerate = async () => {
    if (!canSubmit) return

    const now = Date.now()
    if (now - lastSubmitRef.current < 2000) return
    lastSubmitRef.current = now

    setIsLoading(true)
    setLimitation(null)
    setHasGenerated(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.trim(),
          mode,
          name: isBackronym ? targetName.trim() : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setNames([])
        const code: LimitationCode =
          data?.code === "rate_limit_minute" ||
          data?.code === "quota_exceeded" ||
          data?.code === "server_busy" ||
          data?.code === "invalid_input"
            ? data.code
            : "server_busy"
        setLimitation({ code, description: data?.error })
        return
      }

      const remaining = res.headers.get("X-RateLimit-Remaining")
      if (remaining !== null) {
        setRemainingQuota(Number(remaining))
      }

      const withIds: GeneratedName[] = (data.names ?? []).map(
        (n: { name: string; style: string }, i: number) => ({
          id: `${Date.now()}-${i}`,
          name: n.name,
          style: n.style,
        }),
      )

      if (withIds.length === 0) {
        setLimitation({ code: "no_results" })
        return
      }

      setNames(withIds)
    } catch {
      setNames([])
      setLimitation({ code: "network_error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleCopy = async (item: GeneratedName) => {
    const text = isBackronym ? `${item.name} — ${item.style}` : item.name
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId((c) => (c === item.id ? null : c)), 1500)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  const resultHeading = isBackronym
    ? `${names.length} expansions of ${targetName.trim().toUpperCase()}`
    : `${names.length} ideas for you`

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Mode toggle */}
        <div
          role="tablist"
          aria-label="Naming mode"
          className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1"
        >
          <button
            role="tab"
            aria-selected={!isBackronym}
            type="button"
            onClick={() => switchMode("generate")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              !isBackronym
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Generate names
          </button>
          <button
            role="tab"
            aria-selected={isBackronym}
            type="button"
            onClick={() => switchMode("backronym")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isBackronym
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Backronym
          </button>
        </div>

        {isBackronym && (
          <div className="mb-4">
            <label htmlFor="target-name" className="mb-2 block text-sm font-medium text-foreground">
              Name to expand
            </label>
            <input
              id="target-name"
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value.replace(/[^A-Za-z]/g, ""))}
              onKeyDown={handleKeyDown}
              placeholder="e.g. NOVA"
              maxLength={12}
              autoCapitalize="characters"
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base uppercase tracking-widest text-foreground outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Name to expand into a backronym"
            />
          </div>
        )}

        <label htmlFor="keywords" className="mb-2 block text-sm font-medium text-foreground">
          Describe your app or assistant
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. smart home assistant"
            
            maxLength={200}
            className="h-12 p-2 resize-vertical max-h-[100px] flex-1 rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="App description"
          ></textarea>
          <Button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="h-12 gap-2 px-6 text-base font-medium sm:w-auto w-full"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Wand2 className="size-5" aria-hidden="true" />
            )}
            {isLoading ? "Generating" : isBackronym ? "Expand" : "Generate"}
          </Button>
        </div>

        {!isBackronym && (
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
        )}

        {isBackronym && (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Enter a word (like NOVA or EDITH) and JANE will turn each letter into a phrase that
            fits your app.
          </p>
        )}
      </div>

      {hasGenerated && (
        <div className="mt-8">
          {isLoading ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <li
                  key={i}
                  className="h-[68px] animate-pulse rounded-xl border border-border bg-secondary"
                />
              ))}
            </ul>
          ) : limitation ? (
            <LimitationNotice code={limitation.code} description={limitation.description} />
          ) : names.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {resultHeading}
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
              {remainingQuota !== null && remainingQuota <= 3 && (
                <p className="mb-3 text-xs text-muted-foreground">
                  {remainingQuota} generation{remainingQuota === 1 ? "" : "s"} remaining today
                </p>
              )}
              <ul
                className={
                  isBackronym
                    ? "flex flex-col gap-3"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2"
                }
              >
                {names.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleCopy(n)}
                      className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-colors active:scale-[0.98] hover:border-primary hover:bg-secondary sm:gap-3 sm:px-4 sm:py-3.5"
                    >
                      <span className="flex flex-col">
                        <span className="font-serif text-lg font-semibold uppercase tracking-wide text-foreground">
                          {n.name}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {n.style}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
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
