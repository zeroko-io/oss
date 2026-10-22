import type { Metadata } from "next"
import { Geist, Geist_Mono, Lora } from "next/font/google"

import "@zeroko/ui/globals.css"
import { cn } from "@zeroko/ui/lib/utils"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const serif = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: { default: "Zeroko", template: "%s · Zeroko" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark antialiased",
        sans.variable,
        mono.variable,
        serif.variable
      )}
    >
      <body>{children}</body>
    </html>
  )
}
