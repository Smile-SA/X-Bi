import axios from "axios";
import {generateAPIUrl} from "../settings/variables";

export function getInstances() {
    return axios.get(generateAPIUrl() + '/instances/list').then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        console.log('An error occurred while getting the instances! Please try later');
        return {
            "total": 0
        };
    });
}

export function addInstance(metric_name,template_name,cpu,memory,price,timeframe) {
    const Params = new FormData();
    Params.append("metric_name", metric_name);
    Params.append("template_name", template_name);
    Params.append("cpu", cpu);
    Params.append("memory", memory);
    Params.append("price", price);
    Params.append("timeframe", timeframe);

    return axios.post(generateAPIUrl() + '/instances/add',Params).then(async (r) => {
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

export function getInstance(metric_name) {
    return axios.get(generateAPIUrl() + '/instances/get?metric_name='+metric_name).then(async (r) => {
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

export function deleteInstance(query_name) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    return axios.post(generateAPIUrl() + '/instances/delete',Params).then(async (r) => {
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