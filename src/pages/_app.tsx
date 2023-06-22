import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/themeContext'
import Navbar from '@/components/Partials/Navbar';
import Sidebar from '@/components/Partials/Sidebar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
        <Navbar />
      <div className="flex">
        <Sidebar />
      <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}