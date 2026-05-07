import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/layout/CartSidebar'
import WelcomeModal from '@/components/WelcomeModal'
import Providers from '@/components/Providers'
import CartSessionSync from '@/components/CartSessionSync'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Irida Studio — Papelería y diseño',
    template: '%s | Irida Studio',
  },
  description:
    'Stickers, agendas, álbumes, fotitos y más. Diseño que se siente tuyo. Esperanza, Santa Fe.',
  keywords: [
    'stickers',
    'papelería',
    'agendas',
    'álbumes',
    'diseño',
    'Argentina',
    'Irida',
  ],
  openGraph: {
    title: 'Irida Studio — Papelería y diseño',
    description: 'Stickers, agendas, álbumes, fotitos y más. Diseño que se siente tuyo.',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <CartSidebar />
          <WelcomeModal />
          <CartSessionSync />
        </Providers>
      </body>
    </html>
  )
}
