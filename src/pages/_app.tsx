import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/themeContext'
import Navbar from '@/components/Partials/Navbar';
import Sidebar from '@/components/Partials/Sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { TableProvider } from '@/context/TableContext';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider>
        <AuthProvider>
        <TableProvider>
            <Navbar />
          <div className="flex">
            <Sidebar />
            <Component {...pageProps} />
          </div>
        </TableProvider>
        </AuthProvider>
    </ThemeProvider>
  )
}