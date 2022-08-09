import { createContext, useContext, useReducer } from 'react';
import { AppReducer, initialState } from 'reducers/AppReducer';
import { ContextProps } from 'config/types';

const AppContext = createContext(initialState);

const AppContextWrapper = (props: ContextProps) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContextWrapper;
