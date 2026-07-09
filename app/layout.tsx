import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { PostHogProvider } from '@/components/posthog-provider'
import { Footer } from '@/components/footer'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jane.recraftory.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'JANE — Just Another Naming Engine',
    template: '%s | JANE — Just Another Naming Engine',
  },
  description:
    'JANE generates human-sounding acronym names for your app or AI assistant. Describe your idea and get creative, brandable acronym names instantly.',
  keywords: [
    'acronym name generator',
    'AI name generator',
    'app naming tool',
    'backronym generator',
    'brand name generator',
    'JANE naming engine',
    'JARVIS style names',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'JANE',
    title: 'JANE — Just Another Naming Engine',
    description:
      'Generate human-sounding acronym names for your app or AI assistant. Describe your idea and JANE invents creative, brandable acronym names.',
    url: '/',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'JANE — Just Another Naming Engine',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'JANE — Just Another Naming Engine',
    description:
      'Generate human-sounding acronym names for your app or AI assistant.',
    images: ['/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '192x192' }],
    other: [
      {
        rel: 'icon',
        url: '/icon-512.png',
        sizes: '512x512',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JANE — Just Another Naming Engine',
  description:
    'Generate human-sounding acronym names for your app or AI assistant.',
  url: siteUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <PostHogProvider>
          <div className="flex min-h-screen flex-col">
            {children}
            <Footer />
          </div>
        </PostHogProvider>
      </body>
    </html>
  )
}
