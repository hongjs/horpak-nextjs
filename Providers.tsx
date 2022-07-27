import ThemeContextProvider from './contexts/ThemeContext';
import Layout from './components/layout/Layout';

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }: Props) => {
  return (
    <ThemeContextProvider>
      <Layout>{children}</Layout>
    </ThemeContextProvider>
  );
};

export default Providers;
