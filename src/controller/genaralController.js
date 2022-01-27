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

export async function getDataByVariableAndDateToApex(url, config, that) {
    const queryDate = utils.convertURLDateParameter(that.from, that.to)
    url = api + url + queryDate;
    return axios.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            let data = utils.groupBy(r.data.results, config.sort);
            Object.keys(data).map((item) => {
                data[item] = utils.groupByDate(data[item], that.group);
                Object.keys(data[item]).map((subItem) => {
                    data[item][subItem] = data[item][subItem].reduce(function (r, a) {
                        if (!r[a[config.sort]]) {
                            r[a[config.sort]] = {label: config.sort, value: a[config.sort], frame_price: 0, length: 0};
                        }
                        r[a[config.sort]].frame_price += a.frame_price;
                        r[a[config.sort]].frame_begin = subItem;
                        r[a[config.sort]].length += +1;
                        return r;
                    }, Object.create(null));
                });
            });
            let cs = utils.createSerie(data,config,null,3)
            r.data.series = cs.series
            r.data.lastDate = cs.lastDate
            r.data.options = utils.createOption(config);
            r.data.height = config.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

export async function getDataByDateToApex(url,from,to,name,group,config) {
    const queryDate = utils.convertURLDateParameter(from, to)
    url = api + url + queryDate;
    return axios.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            let data = utils.groupByDate(r.data.results, group);
            Object.keys(data).map((item) => {
                data[item] = data[item].reduce(function (r, a) {
                    if(r.label===undefined){
                        r = { [config.labels.value]: 0, length: 0};
                    }
                    r[config.labels.value] += a[config.labels.value];
                    r.frame_begin = item;
                    r.length += +1;
                    return r;
                }, Object.create(null));
            });
            let cs = utils.createSerie(data,config,name,1)
            r.data.series = cs.series;
            r.data.lastDate = cs.lastDate;
            r.data.options = utils.createOption(config);
            r.data.height = config.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

// eslint-disable-next-line no-unused-vars
export async function getNewDataByDateToApex(url,from,to,name,group,config,lastDate) {
        return getDataByDateToApex(url,from,to,name,group,config)
}

export function getJsonData(url) {
    return axios.get(api + url).then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

