import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"

import "./globals.css"
import { title } from "@/constants"
import { Toaster } from "../components/ui/toaster"

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: title,
  description:
    "Simple, but powerful, privacy-friendly tool for working with tabular data using JavaScript. Supports CSV, TSV, XLSX, JSON",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${roboto.className} ${roboto.variable} ${roboto_mono.variable}`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
