'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/lib/theme';
import { CssBaseline } from '@mui/material';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
              <CssBaseline/>
              {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </SessionProvider>
  )
}