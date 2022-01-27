import axios from "axios";
import {generateAPIUrl} from "../settings/variables";

const api = generateAPIUrl();

export function getTemplates() {
    return axios.get(api + '/templates/list').then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        console.log('An error occurred while getting the templates! Please try later');
        return {
            "total": 0
        };
    });
}

export function addTemplate(query_name, query_group, query_template, query_variables) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    Params.append("query_group", query_group);
    Params.append("query_template", query_template);
    if (query_variables.trim() === '') {
        //
    } else {
        Params.append("query_variables", query_variables);
    }
    return axios.post(api + '/templates/add', Params).then(async (r) => {
        return {
            errors: false,
            message: r.data
        }
    }).catch(errors => {
        return {
            errors: true,
            message: errors.response.data
        };
    });
}

export function defaultValue(query_name) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    return axios.get(api + '/templates/get?query_name=' + query_name).then(async (r) => {
        if(r.data.results.spec.admin !== undefined){
            return r.data.results.spec.admin;
        }
        return false
    }).catch(errors => {
        return {
            errors: true,
            message: errors.response.data
        };
    });
}

export function getTemplate(query_name) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    return axios.get(api + '/templates/get?query_name=' + query_name).then(async (r) => {
        return {
            errors: false,
            data: r.data
        }
    }).catch(errors => {
        return {
            errors: true,
            message: errors.response.data
        };
    });
}

export function deleteTemplate(query_name) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    return axios.post(api + '/templates/delete', Params).then(async (r) => {
        return {
            errors: false,
            message: !!r.data
        }
    }).catch(errors => {
        return {
            errors: true,
            message: errors.response.data
        };
    });
}