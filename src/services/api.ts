import axios from "axios";
import { getUserLocalStorage } from "../context/AuthProvider/utils";

export const Api = axios.create({
    baseURL: "http://dev4ccstecno.megaerp.online:5900/api/"
});

// Alter defaults after instance has been created
//const user = getUserLocalStorage();
//Api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('ccsSchedule').token}`;

Api.interceptors.request.use(
    config => {
      const user = getUserLocalStorage();
      if (user) {
        //config.headers.Authorization = `Bearer ${user.token}`;
        config.headers = {
            Authorization: 'Bearer ' + user?.token,
        };

      }
      return config;
    },
    error => {
      if (error.response.status === 401) {
      
        Promise.reject(error)
       }else{
      Promise.reject(error)}
      return error;
       }
  );
