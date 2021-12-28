import axios from "axios";
import {generateAPIUrl} from "../settings/variables";
import * as utils from "../settings/utils";

export function generalDelete(deleteUrl, name, id) {
    const Params = new FormData();
    Params.append(name, id);
    // eslint-disable-next-line no-unused-vars
    return axios.post(generateAPIUrl() + deleteUrl, Params).then(async (r) => {
        return !!r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

export async function getJsonDataToApex(url, c, that) {

    const queryDate = utils.convertURLDateParameter(that.from, that.to)
    url = url + queryDate;
    return axios.get(url).then(async (r) => {
        console.log(r)
        if (r.data.total <= 0) {
            return {total: 0, results: null}
        } else if (r.data.total > 0) {
            let datas = utils.groupBy(r.data.results, c.sort);
            Object.keys(datas).map((item) => {
                datas[item] = datas[item].reduce((groups, r) => {
                    let date = r.frame_begin;
                    let da = date.split(', ')[1].split(' ');
                    if (that.group === 'Day') {
                        date = da[0]+' '+ da[1] + ' ' + da[2];
                    }else
                    if (that.group === 'Month') {
                        date =  da[1] + ' ' + da[2];
                    }else{
                        if (that.group === 'Year') {
                            date = da[2];
                        }
                    }
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push(r);
                    return groups;
                }, {});
                Object.keys(datas[item]).map((subItem) => {
                    let data = datas[item][subItem].reduce(function (r, a) {
                        if (!r[a[c.sort]]) {
                            r[a[c.sort]] = {label: c.sort, value: a[c.sort], frame_price: 0, length: 0};
                        }
                        r[a[c.sort]].frame_price += a.frame_price;
                        r[a[c.sort]].frame_begin = subItem;
                        r[a[c.sort]].length += +1;
                        //return res;
                        return r;
                    }, Object.create(null));
                    datas[item][subItem] = data;
                });

            });
            let min = 0
            let max = 0
            r.data.series = [];
            Object.keys(datas).map(item => {
                const obj = []
                Object.keys(datas[item]).map((subItem) => {
                    Object.keys(datas[item][subItem]).map((subSubItem) => {
                        const fixed = datas[item][subItem][subSubItem][c.labels.value].toFixed(5)
                        const date = new Date(datas[item][subItem][subSubItem][c.labels.time]).getTime();
                        const minTmp = Math.min(fixed)
                        const maxTmp = Math.max(fixed)
                        if (min === 0 || minTmp < min) {
                            min = minTmp
                        }
                        if (max === 0 || maxTmp > max) {
                            max = maxTmp
                        }
                        obj.push([date, fixed])
                    });
                });
                r.data.series.push({
                    name: item,
                    data: obj
                });
            })
            r.data.options = {
                chart: {
                    id: c.id, type: c.type
                },
                xaxis: {
                    type: c.xaxis.type,
                    style: {
                        fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                        fontWeight: 0,
                        color: '#676a6c',
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                            fontWeight: 0,
                            color: '#676a6c',
                            fontSize: '12px'
                        },
                    },
                },
                labels: {
                    style: {
                        fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                        fontWeight: 0,
                        color: '#676a6c',
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                title: {
                    text: c.labels.title,
                    style: {
                        fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                        fontWeight: 0,
                        color: '#676a6c',
                    },
                },
                legend: {
                    fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                    fontWeight: 0,
                    color: '#676a6c',
                    fontSize: '14px',
                }
            };
            r.data.height = c.height;
            delete r.data.results;
            return r.data;
        }
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });

}

export function getJsonData(url) {
    return axios.get(generateAPIUrl() + url).then(async (r) => {
        return r.data;
        // eslint-disable-next-line no-unused-vars
    }).catch(errors => {
        return false
    });
}

