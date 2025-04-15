import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL('https://giftorium.vercel.app'),
  title: {
    default: "Gift Orium - Premium Gift Shop | Find Perfect Gifts Online",
    template: "%s | Gift Orium"
  },
  description: "Discover unique and thoughtful gifts for all occasions at Gift Orium. Shop premium gifts, flowers, soft toys, religious items, and more with fast delivery across India.",
  keywords: ["gifts", "online gift shop", "premium gifts", "flowers", "soft toys", "religious gifts", "gift delivery", "India"],
  authors: [{ name: "Gift Orium" }],
  creator: "Gift Orium",
  publisher: "Gift Orium",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://giftorium.vercel.app',
    title: 'Gift Orium - Premium Gift Shop | Find Perfect Gifts Online',
    description: 'Discover unique and thoughtful gifts for all occasions at Gift Orium. Shop premium gifts, flowers, soft toys, religious items, and more.',
    siteName: 'Gift Orium',
    images: [{
      url: '/landing.jpg',
      width: 1200,
      height: 630,
      alt: 'Gift Orium - Premium Gift Shop'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gift Orium - Premium Gift Shop | Find Perfect Gifts Online',
    description: 'Discover unique and thoughtful gifts for all occasions at Gift Orium. Shop premium gifts, flowers, soft toys, religious items, and more.',
    images: ['/landing.jpg'],
    creator: '@giftorium',
    site: '@giftorium',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning itemScope itemType="http://schema.org/WebSite">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



