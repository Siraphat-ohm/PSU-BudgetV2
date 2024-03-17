'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import {ThemeProvider as NextThemesProvider} from "next-themes"
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <SessionProvider>
        <NextUIProvider>
            <NextThemesProvider 
              attribute="class" 
              defaultTheme="light" 
              themes={[ 'light', 'dark' ]}
            >
              <Toaster position="top-right"/>
              {children}
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
    </Suspense>
  )
}