import React from 'react';
import { useContext } from 'react';
import { IUser } from './backend';

interface IAuthContext {
  user: IUser;
  onSignOut: () => void;
}

export const authContext = React.createContext<IAuthContext>({
  user: {
    name: 'Anonymous',
    email: '',
  },
  onSignOut: () => {},
});

export function useAuthContext() {
  return useContext(authContext);
}
