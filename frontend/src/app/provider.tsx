'use client'

import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import {ThemeProvider as NextThemesProvider} from "next-themes"
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

export default async function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <SessionProvider>
        <NextUIProvider>
            <NextThemesProvider 
              attribute="class" 
              defaultTheme="light" 
              themes={[ 'light', 'dark' ]}
            >
              {children}
              <Toaster position="top-right"/>
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
    </Suspense>
  )
}