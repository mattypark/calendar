import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import PHProvider from '@/components/PostHogProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  )
}
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SOHS Calendar Sync - South Oldham High School Event Synchronization',
  description: 'Sync South Oldham High School events to your Google Calendar. Stay updated with all school activities, sports events, and important dates.',
  keywords: 'South Oldham High School, calendar sync, Google Calendar, school events, SOHS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}