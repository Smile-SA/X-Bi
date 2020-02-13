export const generateAPIUrl = () => {
    if (window._env_.RATING_API_URL === undefined) {
        return 'http://localhost:5012'
    } else if (window._env_.RATING_API_URL.startsWith('http')) {
        return window._env_.RATING_API_URL
    } else if (window._env_.RATING_API_URL.startsWith('localhost')) {
        return `http://${window._env_.RATING_API_URL}`
    } else {
        return `${window.location.href.split('#')[0]}${window._env_.RATING_API_URL}`
    }
}

export const generatePromUrl = () => {
    if (window._env_.PROMETHEUS_API_URL === undefined) {
        return 'http://localhost:9090/api/v1'
    } else if (window._env_.PROMETHEUS_API_URL.startsWith('http')) {
        return `${window._env_.PROMETHEUS_API_URL}/api/v1`
    } else if (window._env_.PROMETHEUS_API_URL.startsWith('localhost')) {
        return `http://${window._env_.PROMETHEUS_API_URL}/api/v1`
    } else {
        return `${window.location.href.split('#')[0]}${window._env_.PROMETHEUS_API_URL}`
    }
}