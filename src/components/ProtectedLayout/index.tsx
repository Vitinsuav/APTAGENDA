import React from "react";
import { useAuth } from "../../context/AuthProvider/useAuth"
import { SignIn } from "../../screens/SignIn";

export function ProtectedLayout ({children} : { children : JSX.Element}){
    const auth = useAuth();
    if(!auth.name){
        return <SignIn/>
    }

    return children;
};
