import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import React from 'react'
import { Props } from 'types'
import theme from '../styles/theme'

const ThemeContextProvider: React.FC<Props> = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  )
}

export default ThemeContextProvider
