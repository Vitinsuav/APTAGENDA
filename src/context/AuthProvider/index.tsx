import React, {createContext, useEffect, useState} from "react";
import { IAuthProvider, IContext, IUser } from "./types";
import { getUserLocalStorage, LoginRequest, setUserLocalStorage } from "./utils";

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider = ({children} : IAuthProvider) => {

    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        async function getUser(){
            const user = await getUserLocalStorage();
            if(user){
                setUser(user);
            }
        }

        getUser();
        
    }, []);

    async function authenticate(login: string, password: string){
        const response = await LoginRequest(login, password);
        const payload = {token: response.token, email: response.user.name, name: response.user.name}
        setUser(payload);
        setUserLocalStorage(payload);
    }

    function logout(){
        setUser(null);
        setUserLocalStorage(null);
    }

    return(
        <AuthContext.Provider value={{...user, authenticate, logout}}>
            {children}
        </AuthContext.Provider>
    );
}