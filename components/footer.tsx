import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background px-4 py-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {year} Recraftory. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link href="https://recraftory.com/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="https://recraftory.com/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="https://buymeacoffee.com/egig">
            Support This Project
          </Link>
        </nav>
      </div>
    </footer>
  )
}
