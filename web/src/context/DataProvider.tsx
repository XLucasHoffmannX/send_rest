import React, { createContext } from 'react'
import Cookies from 'js-cookie';
import { UserApi } from '../app/api/UserApi';

export const ContextState = createContext({});

export default function DataProvider({ children }: any) {
    const [token, setToken] = React.useState<boolean | any>(false);

    React.useEffect(() => {
        setToken(Cookies.get('access-token'));
    }, [token, setToken])

    const state = {
        token: [token, setToken],
        userApi: UserApi(token),
    }

    return (
        <ContextState.Provider value={state}>
            {children}
        </ContextState.Provider>
    )
}
