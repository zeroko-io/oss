import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@zeroko/ui/globals.css"
import { cn } from "@zeroko/ui/lib/utils"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Zeroko",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("dark antialiased", sans.variable, mono.variable)}>
      <body>{children}</body>
    </html>
  )
}
