import axios from "axios";

export const generateAPIUrl = () => {
    if (window._env_ === undefined || window._env_.RATING_API_URL === undefined) {
        return 'http://localhost:5012'
    } else if (window._env_.RATING_API_URL.startsWith('http')) {
        return window._env_.RATING_API_URL
    } else if (window._env_.RATING_API_URL.startsWith('localhost')) {
        return `http://${window._env_.RATING_API_URL}`
    } else {
        return `${window.location.href.split('#')[0]}${window._env_.RATING_API_URL}`
    }
}

export const generateLstmUrl = () => {
    return 'http://localhost:5000'
}

export const ratingOperatorInstanceRequest = () => {
    const instance = axios.create({
        baseURL: generateAPIUrl()
    });
    instance.defaults.headers.get['Content-Type'] = 'application/json';
    return instance;
}

export const lstmInstanceRequest = () => {
    const instance = axios.create({
        baseURL: generateLstmUrl()
    });
    return instance;
}

export const generatePromUrl = () => {
    if (window._env_ === undefined || window._env_.PROMETHEUS_API_URL === undefined) {
        return 'http://localhost:9090/api/v1'
    } else if (window._env_.PROMETHEUS_API_URL.startsWith('http')) {
        return `${window._env_.PROMETHEUS_API_URL}/api/v1`
    } else if (window._env_.PROMETHEUS_API_URL.startsWith('localhost')) {
        return `http://${window._env_.PROMETHEUS_API_URL}/api/v1`
    } else {
        return `${window.location.href.split('#')[0]}${window._env_.PROMETHEUS_API_URL}`
    }
}
