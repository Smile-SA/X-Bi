import axios from "axios";
import {generateAPIUrl} from "../settings/variables";
import * as utils from "../settings/utils";
const api = generateAPIUrl();
export function generalDelete(deleteUrl, name, id) {
    const Params = new FormData();
    Params.append(name, id);
    // eslint-disable-next-line no-unused-vars
    return axios.post(api + deleteUrl, Params).then(async (r) => {
        return !!r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}
export async function getDataByVariableAndDateToApex(config, that) {
    const queryDate = utils.convertURLDateParameter(that.from, that.to)
    let url = api + that.queryBegin + config.query + queryDate;
    return axios.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            let data = utils.groupBy(r.data.results, config.sort_key);
            Object.keys(data).map((item) => {
                data[item] = utils.groupByDate(data[item], that.group,config.time_key);
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
            let cs = utils.createSerie(data, config, null, 3)
            r.data.series = cs.series
            r.data.lastDate = cs.lastDate
            r.data.options = utils.createOption(config, cs.labels, cs.colors);
            r.data.height = that.styles.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}
export async function getDataByDateToApex(config, that,name) {
    const queryDate = utils.convertURLDateParameter(that.from, that.to)
    let url = api + that.queryBegin + config.query + queryDate;
    return await axios.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {

            let data = utils.groupByDate(r.data.results, that.group,config.time_key);
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
            let cs = utils.createSerie(data, config, name, 1)
            r.data.series = cs.series
            r.data.lastDate = cs.lastDate
            r.data.options = utils.createOption(config);
            r.data.height = that.styles.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}
// eslint-disable-next-line no-unused-vars
export async function getSparkCardData(config, that,name) {
    const queryDate = utils.convertURLDateParameter(that.from, that.to)
    let url = api + that.queryBegin + config.query + queryDate;
    return await axios.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            /*let data = utils.groupByDate(r.data.results, that.group,config.query_key);
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
            let cs = utils.createSerie(data, config, name, 1)
            r.data.series = cs.series

            r.data.lastDate = cs.lastDate*/
            r.data.series =  [{
                name: config.title,
                data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21]
            }],
            r.data.options = utils.createSparkOption(config,r.data.total);
            r.data.height = r.data.options.chart.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}
export async function getJsonData(url) {
    return await axios.get(api + url).then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return {
            total: 0
        }
    });
}

