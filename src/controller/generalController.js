import * as chartController from "../controller/chartController";
import axios from "axios";
import * as uiConfigurations from "@/uiConfigurations.json"
const apiInfo = uiConfigurations.apiInfo;

export function get(url) {
    return axios.get(url).then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(error => {
        // console.log('An error occurred while getting the instances! Please try later');
        return {
            "total": 0
        };
    });
}

export function generalDelete(deleteUrl, name, id) {
    const params = new FormData();
    params.append(name, id);
    return axios.post(deleteUrl, params).then(async (r) => {
        if (r.data !== true) {
            if (!!r.data === true) {
                return {
                    result: !!r.data,
                    message: {
                        title: 'Delete failed',
                        description: r.data
                    }
                }
            } else {
                return {
                    result: !!r.data,
                    message: {
                        title: 'Delete failed',
                        description: 'An error occurred while deleting ! Please try later',
                    }
                }

            }
        } else {
            return {
                result: !!r.data,
                message: {
                    title: 'Successfully deleted'
                }
            }
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return {
            result: false,
            message: {
                title: 'Delete failed',
                description: 'An error occurred while deleting ! Please try later',
            }
        }
    });
}

export function getById(url, id, value, isStatic) {
    let fullUrl = url + '?' + id + '=' + value;
    if (isStatic) {
        fullUrl = url + '/' + value + '.json';
    }
    return axios.get(fullUrl).then(async (r) => {
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
export function generalAdd(addUrl, model) {
    const params = new FormData();
    Object.keys(model).map((item) => {
        if (item === 'query_variables' && model[item].trim() === '') {
            //
        } else {
            params.append(item, model[item]);
        }

    })
    return axios.post(addUrl,params).then(async (r) => {
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

export async function getJsonData(config, additionalUrl, queryData) {
    let url = config.query
    if (additionalUrl !== '' && additionalUrl !== null && additionalUrl !== undefined) {
        var parser = document.createElement('a');
        parser.href = config.query;
        url = parser.protocol + '//' + parser.host + (process.env.NODE_ENV === 'development' ? '' : '/') + additionalUrl + parser.pathname
    }
    return await axios.get(url, {params: queryData}).then(async (r) => {
        if (r.data.total) {
            return {total: r.data.total, results: r.data.results};
        } else return {total: Object.keys(r.data).length, results: r.data.results ? r.data.results : r.data};
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return {total: 0, results: null}
    });
}

export function convertURLDateParameter(from, to) {
    from = (from !== null) ? from : new Date(new Date().setHours(new Date().getHours() - 1)).toISOString()
    to = (to !== null) ? to : new Date().toISOString()
    from = from.replace('T', ' ')
    to = to.replace('T', ' ')
    return `?start=${from}&end=${to}`
}

export function titleBoxRender(that) {
    that.hover = true;
    if (that.hover === true) {
        setTimeout(() => {
            that.hover = false
        }, 10000);
    }
}

export async function getDataByVariableAndDateToApex(config, additionalUrl, queryData, group, styles, routeName = null) {
    let url = config.query
    if (additionalUrl !== '' && additionalUrl !== null && additionalUrl !== undefined) {
        var parser = document.createElement('a');
        parser.href = config.query;
        url = parser.protocol + '//' + parser.host + (process.env.NODE_ENV === 'development' ? '' : '/') + additionalUrl + parser.pathname
    }
    return axios.get(url, {params: queryData}).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {

            if(apiInfo.dataType === 'static') {
                if (routeName !== 'Overall') {
                    r.data.results.map((item, index) => {
                        const startDate = new Date(queryData.start);
                        const endDate = new Date(queryData.end);
                        const range = endDate - startDate;
                        const step = range / (r.data.results.length + 1);
                        const newDate = new Date(startDate.getTime() + step * (index + 1));
                        // Adjust date
                        item.frame_begin = newDate.toUTCString();
                    });
                }
            }


            let data = chartController.groupBy(r.data.results, config.sort_key);
            Object.keys(data).map((item) => {
                data[item] = chartController.groupByDate(data[item], group, config.time_key);
                Object.keys(data[item]).map((subItem) => {
                    data[item][subItem] = data[item][subItem].reduce(function (r, a) {
                        if (!r[a[config.sort_key]]) {
                            r[a[config.sort_key]] = {
                                label: config.sort_key,
                                value: a[config.sort_key],
                                [config.query_key]: 0,
                                length: 0
                            };
                        }
                        r[a[config.sort_key]][config.query_key] += a[config.query_key];
                        r[a[config.sort_key]][config.time_key] = subItem;
                        r[a[config.sort_key]].length += +1;
                        return r;
                    }, Object.create(null));
                });
            });

            let cs = chartController.createSerie(data, config, null, 3)


            r.data.series = cs.series
            r.data.lastDate = cs.lastDate

            r.data.options = chartController.createOption(config, cs.labels, cs.colors, cs.dataLabel, cs.total);
            r.data.height = styles.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

export async function getDataByDateToApex(config, additionalUrl, queryData, group, styles, name) {
    let url = config.query
    if (additionalUrl !== '' && additionalUrl !== null && additionalUrl !== undefined) {
        var parser = document.createElement('a');
        parser.href = config.query;
        url = parser.protocol + '//' + parser.host + (process.env.NODE_ENV === 'development' ? '' : '/') + additionalUrl + parser.pathname
    }
    return await axios.get(url, {params: queryData}).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            let data = chartController.groupByDate(r.data.results, group, config.time_key);
            Object.keys(data).map((item) => {
                data[item] = data[item].reduce(function (r, a) {
                    if (r[config.query_key] === undefined) {
                        r = {[config.query_key]: 0, length: 0};
                    }
                    r[config.query_key] += a[config.query_key];
                    r[config.time_key] = item;
                    r.length += +1;
                    return r;
                }, Object.create(null));
            });
            let cs = chartController.createSerie(data, config, name, 1)
            r.data.series = cs.series
            r.data.lastDate = cs.lastDate
            r.data.options = chartController.createOption(config);
            r.data.height = styles.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

