import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from '../styles/theme';

interface Props {
  children?: React.ReactNode;
}

const ThemeContextProvider = ({ children }: Props) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeContextProvider;
