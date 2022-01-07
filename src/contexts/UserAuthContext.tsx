import React from 'react';
import { API } from 'aws-amplify';
import jwtDecode from 'jwt-decode';

import { getAccessToken } from 'utils/helpers';
import { UserActionTypes, User } from 'types';

interface UserState {
  user?: User;
  isLoading: boolean;
}

type UserDispatch = (action: UserAction) => void;
type UserAction =
  | { type: UserActionTypes.LOADING }
  | { type: UserActionTypes.UNLOADING }
  | { type: UserActionTypes.SUCCESS; payload: User };

const UserStateContext = React.createContext<UserState | undefined>(undefined);
const UserDispatchContext = React.createContext<UserDispatch | undefined>(
  undefined
);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionTypes.LOADING: {
      return { isLoading: true };
    }
    case UserActionTypes.UNLOADING: {
      return { isLoading: false };
    }
    case UserActionTypes.SUCCESS: {
      return { isLoading: false, user: action.payload };
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
}

export const UserProvider: React.FC<{}> = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(userReducer, { isLoading: true });

  React.useEffect(() => {
    const handleGetUser = async () => {
      const accessToken = getAccessToken();

      if (accessToken) {
        dispatch({ type: UserActionTypes.LOADING });
        const {
          payload: { id },
        } = jwtDecode(accessToken);

        const user: any = await API.get('auth', `/api/users/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((user: any) => user)
          .catch(() => null);

        dispatch({
          type: UserActionTypes.SUCCESS,
          payload: user,
        });
        return;
      } else {
        dispatch({ type: UserActionTypes.UNLOADING });
      }
    };
    handleGetUser();

    return;
  }, []);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export const useUserState = () => {
  const userStateContext = React.useContext(UserStateContext);
  if (userStateContext === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return userStateContext;
};

export const useUserDispatch = () => {
  const userDispatchContext = React.useContext(UserDispatchContext);
  if (userDispatchContext === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return userDispatchContext;
};
