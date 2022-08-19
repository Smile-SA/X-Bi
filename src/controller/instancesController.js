import {ratingOperatorInstanceRequest} from "../settings/variables";

const roRequest = ratingOperatorInstanceRequest();

export function getInstances() {
    return roRequest.get('/instances/list').then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        console.log('An error occurred while getting the instances! Please try later');
        return {
            "total": 0
        };
    });
}

export function addInstance(values) {
    const Params = new FormData();
    Object.keys(values).map((item) => {
        Params.append(values[item].name, values[item].value)
    })

    return roRequest.post('/instances/add', Params).then(async (r) => {
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

export function getInstance(metric_name) {
    return roRequest.get('/instances/get?metric_name=' + metric_name).then(async (r) => {
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

export function deleteInstance(query_name) {
    const Params = new FormData();
    Params.append("query_name", query_name);
    return roRequest.post('/instances/delete', Params).then(async (r) => {
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