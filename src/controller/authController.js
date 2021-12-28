import {generateAPIUrl} from "../settings/variables";
import axios from "axios";

export async function checkConnectionWithAPI(){
    // eslint-disable-next-line no-unused-vars
    axios.get(generateAPIUrl()).catch(error => {
        logOut();
    });
}

export async function logIn(tenant,password){
    const User = new FormData();
    User.append("tenant", tenant);
    User.append("password", password);
    // eslint-disable-next-line no-unused-vars
    return axios.post(generateAPIUrl()+`/login_user`, User).then(async (r) => {
        if (r.data.login===true){
            window.sessionStorage.setItem('isLogin', r.data.login);
            window.sessionStorage.setItem('tenant', tenant);
            window.sessionStorage.setItem('timestamp', Date.now());
            return r.data;
        }else{
            deleteSession();
            return {
                login : r.data.login,
                message : 'There was an error ! Please try again'
            };
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        deleteSession();
        return {
            login : false,
            message : 'Check your internet connection and try again !'
        };

    });
}

export async function deleteSession() {
    window.sessionStorage.clear();
    window.localStorage.clear();
}

export async function logOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.location.href = '/login';
}