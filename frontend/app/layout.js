import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Eccles Institute of Neuroscience, Neuroscience News & Events',
  description: 'The Eccles Institute of Neuroscience, Neuroscience News & Events',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
