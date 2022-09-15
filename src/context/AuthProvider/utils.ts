import { Api } from "../../services/api";
import { IUser } from "./types";

export function setUserLocalStorage(user: IUser | null){
    localStorage.setItem('ccsSchedule', JSON.stringify(user));
}

export function getUserLocalStorage(){
    const json = localStorage.getItem('ccsSchedule');

    if(!json){
        return null;
    }else{
        const user = JSON.parse(json);
        return user ?? null;
    }
}

export async function LoginRequest(login: string, password: string){
    try {
        const request = await Api.post("Auth/signin", { login, password}) ;
        return request.data;
    } catch (error) {
        return null;
    }
}