import * as variables from "../settings/variables";
const roRequest = variables.ratingOperatorInstanceRequest();
const lstRequest = variables.lstmInstanceRequest();
 import * as chartController from "../controller/chartController"

export function generalDelete(deleteUrl, name, id) {
    const Params = new FormData();
    Params.append(name, id);
    return roRequest.post(deleteUrl, Params).then(async (r) => {
        return !!r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

export async function getJsonData(url, method) {
    let request = roRequest;
    if (method && method === 'lstm') {
        request = lstRequest;
    }
    return await request.get(url).then(async (r) => {
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

export async function getDataByVariableAndDateToApex(config, that) {
    const queryDate = convertURLDateParameter(that.from, that.to)
    let url = that.queryBegin + config.query + queryDate;
    return roRequest.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            let data = chartController.groupBy(r.data.results, config.sort_key);
            Object.keys(data).map((item) => {
                data[item] = chartController.groupByDate(data[item], that.group, config.time_key);
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
            r.data.height = that.styles.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

export async function getDataByDateToApex(config, that, name) {

    const queryDate = convertURLDateParameter(that.from, that.to)
    let url = that.queryBegin + config.query + queryDate;
    return await roRequest.get(url).then(async (r) => {
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {

            let data = chartController.groupByDate(r.data.results, that.group, config.time_key);
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
            r.data.height = that.styles.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

