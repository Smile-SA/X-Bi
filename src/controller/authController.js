import * as uiConfigurations from "../uiConfigurations.json"
import axios from "axios";
let apiInfo = uiConfigurations.apiInfo;

export async function checkConnectionWithAPI() {
    // eslint-disable-next-line no-unused-vars
    axios.get(apiInfo.url).catch(error => {
        logOut();
    });
}

export async function logIn(username, password) {
    const User = new FormData();
    User.append("tenant", username);
    User.append("password", password);
    // eslint-disable-next-line no-unused-vars
    return axios.post(apiInfo.login, User).then(async (r) => {
        if (r.data.login === true) {
            window.sessionStorage.setItem('isLogin', r.data.login);
            window.sessionStorage.setItem('user', JSON.stringify({username: username,email: 'rnd@smile.fr',
                image: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"
            }));
            window.sessionStorage.setItem('timestamp', Date.now());
            window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
            r.data.redirectAfterLogin = apiInfo.redirectAfterLogin
            return r.data;
        } else {
            deleteSession();
            return {
                login: r.data.login,
                message: 'There was an error ! Please try again'
            };
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        deleteSession();
        return {
            login: false,
            message: 'Check your internet connection and try again !'
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
    window.location.href = apiInfo.redirectAfterLogout;
}