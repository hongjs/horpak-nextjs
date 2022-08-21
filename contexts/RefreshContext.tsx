import { createContext, useState, useEffect } from 'react';
import { Props } from 'types';

const FAST_INTERVAL = 2000;
const SLOW_INTERVAL = 60000;

export const RefreshContext = createContext({ slow: 0, fast: 0 });

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider: React.FC<Props> = ({ children }) => {
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast((prev) => prev + 1);
    }, FAST_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow((prev) => prev + 1);
    }, SLOW_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshContext.Provider value={{ slow, fast }}>
      {children}
    </RefreshContext.Provider>
  );
};

export default RefreshContextProvider;
