import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { ContextProps } from 'config/types';
import theme from '../styles/theme';

const ThemeContextProvider = ({ children }: ContextProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeContextProvider;
