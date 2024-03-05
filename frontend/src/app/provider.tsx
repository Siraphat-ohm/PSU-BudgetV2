'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import {ThemeProvider as NextThemesProvider} from "next-themes"

export default async function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
          <NextThemesProvider 
            attribute="class" 
            defaultTheme="light" 
            themes={[ 'light', 'dark' ]}
          >
            {children}
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}