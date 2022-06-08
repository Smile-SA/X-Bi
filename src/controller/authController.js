import {ratingOperatorInstanceRequest} from "../settings/variables";
import * as uiConfigurations from "../settings/uiConfigurations.json"

const roRequest = ratingOperatorInstanceRequest();

export async function checkConnectionWithAPI() {
    // eslint-disable-next-line no-unused-vars
    roRequest.get('').catch(error => {
        logOut();
    });
}

export async function logIn(tenant, password) {
    const User = new FormData();
    User.append("tenant", tenant);
    User.append("password", password);
    // eslint-disable-next-line no-unused-vars
    return roRequest.post('/login_user', User).then(async (r) => {
        if (r.data.login === true) {
            window.sessionStorage.setItem('isLogin', r.data.login);
            window.sessionStorage.setItem('tenant', tenant);
            window.sessionStorage.setItem('timestamp', Date.now());
            window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
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
    window.location.href = '/login';
}