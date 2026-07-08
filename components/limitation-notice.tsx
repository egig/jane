"use client"

import {
  AlertCircle,
  Clock,
  Gauge,
  CloudOff,
  Lightbulb,
  WifiOff,
  type LucideIcon,
} from "lucide-react"

export type LimitationCode =
  | "rate_limit_minute"
  | "quota_exceeded"
  | "server_busy"
  | "no_results"
  | "network_error"
  | "invalid_input"

type LimitationConfig = {
  icon: LucideIcon
  title: string
  description: string
  border: string
  bg: string
  iconColor: string
}

const CONFIG: Record<LimitationCode, LimitationConfig> = {
  rate_limit_minute: {
    icon: Clock,
    title: "Just a moment",
    description: "JANE needs a moment to catch her breath. Try again in a few seconds.",
    border: "border-amber-500/30 dark:border-amber-400/20",
    bg: "bg-amber-50 dark:bg-amber-950/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  quota_exceeded: {
    icon: Gauge,
    title: "Daily limit reached",
    description:
      "You've used all 10 free generations for today. Come back tomorrow for a fresh set!",
    border: "border-orange-500/30 dark:border-orange-400/20",
    bg: "bg-orange-50 dark:bg-orange-950/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  server_busy: {
    icon: CloudOff,
    title: "Naming engines are busy",
    description: "All the naming engines are warming up right now. Give it a few seconds and try again.",
    border: "border-muted-foreground/20",
    bg: "bg-secondary",
    iconColor: "text-muted-foreground",
  },
  no_results: {
    icon: Lightbulb,
    title: "Nothing came to mind",
    description: "JANE couldn't cook up anything for that description. Try different keywords.",
    border: "border-muted-foreground/20",
    bg: "bg-secondary",
    iconColor: "text-muted-foreground",
  },
  network_error: {
    icon: WifiOff,
    title: "Connection issue",
    description: "Couldn't reach JANE's servers. Please check your connection and try again.",
    border: "border-destructive/30",
    bg: "bg-destructive/5",
    iconColor: "text-destructive",
  },
  invalid_input: {
    icon: AlertCircle,
    title: "Invalid input",
    description: "Please check your input and try again.",
    border: "border-destructive/30",
    bg: "bg-destructive/5",
    iconColor: "text-destructive",
  },
}

type Props = {
  code: LimitationCode
  description?: string
}

export function LimitationNotice({ code, description }: Props) {
  const c = CONFIG[code]
  const Icon = c.icon

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm text-foreground ${c.border} ${c.bg}`}
      role="alert"
    >
      <Icon className={`mt-0.5 size-5 shrink-0 ${c.iconColor}`} aria-hidden="true" />
      <div>
        <p className="font-medium">{c.title}</p>
        <p className="text-muted-foreground">{description ?? c.description}</p>
      </div>
    </div>
  )
}
