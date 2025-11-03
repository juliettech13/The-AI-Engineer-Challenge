import type { Metadata } from "next"
import { Ubuntu_Mono, Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-poppins"
})

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ubuntu-mono"
})

export const metadata: Metadata = {
  title: "Jules bot 🤖",
  description: "Chat with AI using OpenAI API",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${ubuntuMono.variable} ${poppins.className}`}>{children}</body>
    </html>
  )
}

