export function convertURLDateParameter(from, to) {
    from = (from !== null) ? from : new Date(new Date().setHours(new Date().getHours() - 1)).toISOString()
    to = (to !== null) ? to : new Date().toISOString()
    from = from.replace('T', ' ')
    to = to.replace('T', ' ')
    return `?start=${from}&end=${to}`
}

export function getRandomColor() {
    const chartColors = ['#001f3f', '#10375E', '#173A5E', '#93231D', '#173D5E', '#490B29', '#842D57', '#84512D', '#7F441A', '#a70446', '#7C123D', '#960A42', '#4F6B84', '#3b898d', '#9E511A', '#164F87', '#32415c', '#2C3C5B', '#511714', '#4D6087', '#324C63', '#d2d6de', '#b5bbc8', '#265149', '#538389', '#2D5459', '#4b93b0', '#66A0B7', '#771914', '#701611', '#385C6B', '#377275', '#2E5B50', '#a83d48', '#8E3039', '#842932', '#601F26', '#CC7B41', '#1C4D60', '#1F4B6B', '#1F6B5E', '#77143C', '#771458', '#6D1A42', '#9E351A', '#c26929']
    return chartColors[Math.floor(Math.random() * chartColors.length)]
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

export function groupByDate(array, group, key) {
    return array.reduce((groups, r) => {
        let date = r[key];
        let da = date.split(', ')[1].split(' ');
        if (group === 'day') {
            date = da[0] + ' ' + da[1] + ' ' + da[2];
        } else if (group === 'month') {
            date = da[1] + ' ' + da[2];
        } else if (group === 'year') {
            date = da[2];
        }
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(r);
        return groups;
    }, {});
}

export function createSerie(data, config, serieName, boucle) {
    let min = 0, max = 0, series = [], colors = [], labels = [], lastDate = 0, obj = [], dataLabel = false, total = 0;
    if (boucle === 1) {
        Object.keys(data).map((item) => {
            let date = new Date(data[item][config.time_key]).getTime();
            if (date > lastDate) {
                lastDate = date
            }
            const fixed = data[item][config.query_key].toFixed(5), minTmp = Math.min(fixed), maxTmp = Math.max(fixed)
            if (min === 0 || minTmp < min) {
                min = minTmp
            }
            if (max === 0 || maxTmp > max) {
                max = maxTmp
            }
            obj.push([date, fixed])
        });
        series.push({
            name: serieName, data: obj
        });
    }
    if (boucle >= 3) {
        Object.keys(data).map(item => {
            let obj = [], cal = 0;
            Object.keys(data[item]).map((subItem) => {
                Object.keys(data[item][subItem]).map((subSubItem) => {
                    let date = new Date(data[item][subItem][subSubItem][config.time_key]).getTime();
                    if (date > lastDate) {
                        lastDate = date
                    }
                    const fixed = data[item][subItem][subSubItem][config.query_key].toFixed(5),
                        minTmp = Math.min(fixed), maxTmp = Math.max(fixed)
                    if (min === 0 || minTmp < min) {
                        min = minTmp
                    }
                    if (max === 0 || maxTmp > max) {
                        max = maxTmp
                    }
                    cal = fixed;
                    if ((config.method).includes('top')) {
                        if (fixed > 0.06) {
                            obj.push([date, fixed])
                        }
                    } else {
                        obj.push([date, fixed])
                    }
                });
            });
            if ((config.method).includes('top')) {
                if (cal > 0.06) {
                    series.push({
                        name: item.replaceAll('-', ' '), data: obj
                    });
                }
            } else series.push({
                name: item.replaceAll('-', ' '), data: obj
            });
        });
        // eslint-disable-next-line no-unused-vars
        let newSeries = []
        if (["polarArea", "radar", "radialBar", "donut"].includes(config.type)) {
            dataLabel = true;
            Object.keys(series).map(serie => {
                let x = (series[serie].data.map(item => item[1]).reduce((acc, amount) => parseFloat(acc) + parseFloat(amount))).toFixed(2);
                series[serie].data = parseFloat(x)
                total = total + parseFloat(x)
                newSeries.push(parseFloat(x))
                labels.push(series[serie].name)
                if ((config.title).includes('efficiency')) {
                    if (parseFloat(x) > 70) {
                        colors.push('var(--bs-green)')
                    } else if (parseFloat(x) > 50) {
                        colors.push('var(--bs-yellow)')
                    } else if (parseFloat(x) > 30) {
                        colors.push('var(--bs-orange)')
                    } else if (parseFloat(x) <= 30) {
                        colors.push('var(--bs-red)')
                    }
                }
            })
            series = newSeries;
        }
    }
    return {
        'series': series,
        'labels': labels,
        'colors': colors,
        'lastDate': lastDate,
        'dataLabel': dataLabel,
        'total': total
    };
}

export function generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        //var x =Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
        var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

        series.push([baseval, y, z]);
        baseval += 86400000;
        i++;
    }
    return series;
}

export function createOption(config, labels, colors, dataLabel, total) {
    if (config.type === 'chart') {
        let data = {
            chart: {
                id: config.id,
                type: 'area',
                sparkline: {
                    enabled: true
                },
                group: 'sparklines',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
                },
            }, stroke: {
                curve: 'smooth'
            }, markers: {
                size: 0
            }, tooltip: {
                fixed: {
                    enabled: true, position: 'right'
                }, x: {
                    show: false
                }
            },
        }
        data.stroke = {
            curve: 'straight'
        }
        return data
    } else {
        let data = {
            chart: {
                id: config.id, type: config.type, animations: {
                    enabled: true, easing: 'linear', dynamicAnimation: {
                        speed: 1000
                    }
                },
            },
            dataLabels: {
                enabled: dataLabel
            },
            xaxis: {
                type: 'datetime',
                tickAmount: 12,
                labels: {
                    rotate: 0,
                    style: {
                        fontFamily: 'var(--bs-body-font-family)', color: 'var(--bs-body-color)', fontSize: '11px'
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontFamily: 'var(--bs-body-font-family)', color: 'var(--bs-body-color)', fontSize: '11px'
                    },
                },
            },
            labels: {
                enabled: false, style: {
                    fontFamily: 'var(--bs-body-font-family)', color: 'var(--bs-body-color)'
                },
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: config.title, style: {
                    fontFamily: 'var(--bs-body-font-family)', color: 'var(--bs-body-color)', fontSize: '14px',
                },
            },
            legend: {
                horizontalAlign: 'left',
                position: 'bottom',
                fontSize: '12px',
                fontFamily: 'var(--bs-body-font-family)',
                labels: {
                    colors: 'var(--bs-body-color)',

                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ],
            theme: {
                mode: 'light',
                palette: 'palette1',
            }

        }
        if (total != null && total > 0) {
            data.plotOptions = {
                radialBar: {
                    dataLabels: {
                        total: {
                            show: true,
                            label: "Total",
                            formatter: function () {
                                return total + '%'
                            }
                        }
                    }
                }
            }
        }
        if (labels != null && Object.keys(labels).length > 0) {
            data.labels = labels
        }
        if (colors != null && Object.keys(colors).length > 0) {
            data.colors = colors
        }
        return data
    }


}

export function createSparkOption(config) {
    let colors = {
        "blue": "var(--bs-blue)",
        "cyan": "var(--bs-cyan)",
        "dark": "var(--bs-dark)",
        "green": "var(--bs-green)",
        "indigo": "var(--bs-indigo)",
        "orange": "var(--bs-orange)",
        "pink": "var(--bs-pink)",
        "purple": "var(--bs-purple)",
        "red": "var(--bs-red)",
        "white": "var(--bs-icon-bg)",
        "yellow": "var(--bs-yellow)"
    }
    let data = {
        chart: {
            id: config.id, type: config.type, height: 50, sparkline: {
                enabled: true
            }, group: 'sparklines', animations: {
                enabled: true, easing: 'linear', dynamicAnimation: {
                    speed: 1000
                }
            },
        }, stroke: {
            curve: 'smooth'
        }, markers: {
            size: 0
        }, tooltip: {
            fixed: {
                enabled: true, position: 'right'
            }, x: {
                show: false
            }
        }, colors: [colors[config.color]],
    }
    if (config.type === 'area') {

        data.stroke = {
            curve: 'straight'
        }
    }
    return data
}

export function titleBoxRender(that) {
    that.hover = true;
    if (that.hover === true) {
        setTimeout(() => {
            that.hover = false
        }, 10000);
    }
}