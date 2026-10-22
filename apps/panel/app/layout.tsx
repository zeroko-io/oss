import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Lora } from "next/font/google"
import { cookies } from "next/headers"

import "@zeroko/ui/globals.css"
import { parseTheme, THEME_COOKIE, themeAttribute } from "@zeroko/ui/lib/theme"
import { cn } from "@zeroko/ui/lib/utils"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const serif = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: { default: "Zeroko", template: "%s - Zeroko" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0d" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value)
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={themeAttribute(theme)}
      className={cn(
        "antialiased",
        sans.variable,
        mono.variable,
        serif.variable
      )}
    >
      {/* Browser extensions add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
