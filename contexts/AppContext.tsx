import { createContext, useReducer } from 'react';
import { AppReducer, initialState } from 'reducers/AppReducer';
import { ContextProps } from 'config/types';

export const AppContext = createContext(initialState);

const AppContextWrapper = (props: ContextProps) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextWrapper;
