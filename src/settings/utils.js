import * as configurationsController from "../controller/configurationsController";
import {generateAPIUrl} from "./variables";
// import $ from 'jquery';
const api = generateAPIUrl();

export function convertURLDateParameter(from, to) {
    from = (from !== null) ? from : new Date(new Date().setHours(new Date().getHours() - 1)).toISOString()
    to = (to !== null) ? to : new Date().toISOString()
    from = from.replace('T', ' ')
    to = to.replace('T', ' ')
    return `?start=${from}&end=${to}`
}
export function JSONToCSV(json) {
    const replacer = (key, value) => value === null ? '' : value
    const header = Object.keys(json[0])
    let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    return csv.join('\r\n')
}
export async function fetchTotal(url, that) {
    const queryDate = convertURLDateParameter(that.from, that.to)
    url = api + url + queryDate
    try {
        const response = await fetch(url, {
            credentials: 'include'
        })
        const json = await response.json()
        return json.total
    } catch (error) {
        return 0
    }
}
export async function fetchData(url) {
    const response = await fetch(api + url, {
        credentials: 'include'
    })
    const json = await response.json()
    return json.results;
}
export async function fetchDataAsJSON(url, that) {
    const queryDate = convertURLDateParameter(that.from, that.to)
    url = api + url + queryDate
    const response = await fetch(url, {
        credentials: 'include'
    })
    const json = await response.json()
    if (json.total === 0) {
        return {total: 0, results: null}
    }
    return {total: json.total, results: json.results}
}
export async function downloadFile(url, filename, type) {
    const response = await fetch(api + url, {
        credentials: 'include'
    })
    const json = await response.json()
    let content
    let mime
    if (type === 'JSON') {
        content = await JSON.stringify(json.results)
        mime = 'text/json'
    } else if (type === 'CSV') {
        content = JSONToCSV(json.results)
        mime = 'text/csv'
    }

    const el = document.createElement('a')
    el.setAttribute('href', `data:${mime};charset=utf-8,` + encodeURIComponent(content))
    el.setAttribute('download', filename)
    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
}
export function getPeriod(url) {
    let broken = api + url.split('?')[1].split('&')
    const from = broken[0].split('=')[1].replace(' ', 'T')
    const to = broken[1].split('=')[1].replace(' ', 'T')
    return `_${from}-${to}`
}
export async function generateColor(source) {
    const colors = {}
    for (const obj of source) {
        (await fetchData(`${obj.endpoint}`)).forEach(item => colors[item[obj.key]] = getRandomColor())
    }
    return colors
}
export function getRandomColor() {
    const chartColors = [
        '#001f3f',
        '#10375E',
        '#173A5E',
        '#93231D',
        '#173D5E',
        '#490B29',
        '#842D57',
        '#84512D',
        '#7F441A',
        '#a70446',
        '#7C123D',
        '#960A42',
        '#4F6B84',
        '#3b898d',
        '#9E511A',
        '#164F87',
        '#32415c',
        '#2C3C5B',
        '#511714',
        '#4D6087',
        '#324C63',
        '#d2d6de',
        '#b5bbc8',
        '#265149',
        '#538389',
        '#2D5459',
        '#4b93b0',
        '#66A0B7',
        '#771914',
        '#701611',
        '#385C6B',
        '#377275',
        '#2E5B50',
        '#a83d48',
        '#8E3039',
        '#842932',
        '#601F26',
        '#CC7B41',
        '#1C4D60',
        '#1F4B6B',
        '#1F6B5E',
        '#77143C',
        '#771458',
        '#6D1A42',
        '#9E351A',
        '#c26929'
    ]
    return chartColors[Math.floor(Math.random() * chartColors.length)]
}
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
export function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj);
        return acc
    }, {})
}
export function getUnique(array) {
    var uniqueArray = [];
    // Loop through array values
    if (array !== null) {
        for (var value of array) {
            if (uniqueArray.indexOf(value) === -1) {
                uniqueArray.push(value);
            }
        }
    }
    return uniqueArray;
}
export function groupByDate(array, group) {
    return array.reduce((groups, r) => {
        let date = r.frame_begin;
        let da = date.split(', ')[1].split(' ');
        if (group === 'Day') {
            date = da[0] + ' ' + da[1] + ' ' + da[2];
        } else if (group === 'Month') {
            date = da[1] + ' ' + da[2];
        } else if (group === 'Year') {
            date = da[2];
        }
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(r);
        return groups;
    }, {});
}
export function getURL(data, that) {
    const option = data.target.innerText
    const url = that.queryArray[that.selected]
    const filename = that.selected + getPeriod(url) + '.' + option.toLowerCase()
    downloadFile(url, filename, option)
}
export async function refreshDate(date, that) {

    if (date !== null && date !== undefined) {
        that.from = date.start.toISOString().split('.')[0] + '.000Z'
        if (date.end === null || date.start === date.end) {
            date.end = new Date(that.from)
            date.end.setDate(date.end.getDate() + 1)
        }
        that.to = date.end.toISOString().split('.')[0] + '.000Z'
        that.to = that.to.replace('T', ' ')
        that.from = that.from.replace('T', ' ')
    }

    let s = configurationsController.getCardModels(that.$route.name)
    if (s.data.errors !== true) {
        if (s.data.total > 0) {
            that.structure.card.models = s.data.results;
        }
    } else {
        that.structure.card.models = {};
        that.structure.card.styles = {};
    }

    let c = configurationsController.getChartModels(that.$route.name)
    if (c.data.errors !== true) {
        if (c.data.total > 0) {
            that.structure.chart.models = c.data.results;
            let style = configurationsController.getChartStyles(that.$route.name)
            if (style.data.errors !== true) {
                that.structure.chart.styles = style.data.results;
            }
        }
    } else {
        that.structure.chart.models = {};
        that.structure.chart.styles = {};
    }

}
export async function get(url, that) {
    return await fetchDataAsJSON(api + url, that);
}

export function goTo(route, that) {
    that.$router.push(route);
}

export function createSerie(data, config, serieName, boucle) {
    let min = 0, max = 0, series = [], lastDate = 0, obj = []
    if (boucle === 1) {
        Object.keys(data).map((item) => {
            let date = new Date(data[item][config.time_id]).getTime();
            if (date > lastDate) {
                lastDate = date
            }
            const fixed = data[item][config.value_id].toFixed(5),
                minTmp = Math.min(fixed), maxTmp = Math.max(fixed)
            if (min === 0 || minTmp < min) {
                min = minTmp
            }
            if (max === 0 || maxTmp > max) {
                max = maxTmp
            }
            obj.push([date, fixed])
        });
        series.push({
            name: serieName,
            data: obj
        });
    }
    if (boucle >= 3) {
        Object.keys(data).map(item => {
            let obj = []
            Object.keys(data[item]).map((subItem) => {
                Object.keys(data[item][subItem]).map((subSubItem) => {
                    let date = new Date(data[item][subItem][subSubItem][config.time_id]).getTime();
                    if (date > lastDate) {
                        lastDate = date
                    }
                    const fixed = data[item][subItem][subSubItem][config.value_id].toFixed(5),
                        minTmp = Math.min(fixed), maxTmp = Math.max(fixed)
                    if (min === 0 || minTmp < min) {
                        min = minTmp
                    }
                    if (max === 0 || maxTmp > max) {
                        max = maxTmp
                    }
                    obj.push([date, fixed])
                });
            });
            series.push({
                name: item,
                data: obj
            });
        })
    }
    return {'series': series, 'lastDate': lastDate};
}

export function createOption(config) {
    return {
        chart: {
            id: config.id, type: config.type,
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
        },
        xaxis: {
            type: 'datetime',
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
            text: config.title,
            style: {
                fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                fontWeight: 0,
                color: '#676a6c',
                fontSize: '16px',
            },
        },
        legend: {
            fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
            horizontalAlign: 'left',
            fontWeight: 0,
            color: '#676a6c',
            fontSize: '14px',
            position: 'bottom',
        }
    }
}

export function editTitleBox() {
    setTimeout(() => {
        if ($('#title-box').hasClass('col-md-2')) {
            $('#title-box .apex-box .page-title .title').hide()
            $('#title-box').removeClass('col-md-2');
            $('#title-box').addClass('col-xxl-05 col-md-1 col-sm-2');
            $('#title-box .apex-box .page-title .page-title-icon').removeClass('me-2')
            $('#title-box .apex-box').addClass('text-center')
        }
        if ($('#input-box').hasClass('col-md-10')) {
            $('#input-box').removeClass('col-md-10');
            $('#input-box').addClass('col-xxl-11-5 col-md-11 col-sm-10');
        }
    }, 4000);
}