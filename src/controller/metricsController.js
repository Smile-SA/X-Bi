import axios from "axios";
import {generateAPIUrl} from "../settings/variables";
const api = generateAPIUrl();
export function getMetrics() {
    return axios.get(api + '/metrics').then(async (r) => {
        let data = []
        Object.keys(r.data).map((item) => {
            Object.keys(r.data[item]).map((subItem) => {
                data.push(r.data[item][subItem]['metric']);
            })
        })
        r.data.results = data
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        console.log('An error occurred while getting the metrics! Please try later');
        return {
            "total": 0
        };
    });
}

export function addMetric(values) {
    const Params = new FormData();
    Object.keys(values).map((item) => {
        Params.append(values[item].name, values[item].value)
    })

    return axios.post(api + '/metrics/add',Params).then(async (r) => {
        return {
            errors :false,
            message : r.data
        }
    }).catch(errors => {
        return {
            errors : true,
            message : errors.response.data
        };
    });
}

export function getMetric(metric_name) {
    return axios.get(api + '/metrics/get?metric_name='+metric_name).then(async (r) => {
        return {
            errors :false,
            data : r.data
        }
    }).catch(errors => {
        return {
            errors : true,
            message : errors.response.data
        };
    });
}

export function deleteMetric(query_name) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    return axios.post(api + '/metrics/delete',Params).then(async (r) => {
        return {
            errors :false,
            message : !!r.data
        }
    }).catch(errors => {
        return {
            errors : true,
            message : errors.response.data
        };
    });
}