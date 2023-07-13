import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/context/themeContext'
import Navbar from '@/components/Partials/Navbar';
import Sidebar from '@/components/Partials/Sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { TableProvider } from '@/context/TableContext';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const { isLoggedIn } = useAuth();
  const Router = useRouter();
  
  useEffect(() => {
    if (!isLoggedIn) {
      Router.replace("/auth/login");
    }
  }, [isLoggedIn]);

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