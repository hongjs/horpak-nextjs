'use client'
import { useTheme } from 'next-themes'
import { IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <IconButton className="text-gray-700 dark:text-gray-200">
        <Brightness7 />
      </IconButton>
    )
  }

  return (
    <IconButton
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-gray-700 dark:text-gray-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  )
}
