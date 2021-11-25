<template>
    <div>
        <p class="text-center">
            <strong v-if='this.dataS.length > 0'>{{configuration.labels.title}}</strong>
        </p>
        <canvas class="pointer" :id="idL" :height="height" :titre=dataS.toString()></canvas>
    </div>
</template>

<script>
    import BaseChart from "./BaseChart";
    import * as utils from "../../utils";

    export default {
        name: "LineChart",
        extends: BaseChart,
        props: ['idL', 'height', 'configuration', 'dataS'],
        methods: {
            graphConfiguration(response, c) {
                const graph = []

                const dataset = utils.groupBy(response, c.sort)

                const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

                labels.forEach((item, count) => {
                    labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
                })

                let min = 0
                let max = 0
                Object.keys(dataset).forEach(item => {
                    const obj = []
                    const color = c.colors[item]
                    Object.values(dataset[item]).forEach(subItem => {
                        const fixed = subItem[c.labels.value].toFixed(5)
                        const minTmp = Math.min(fixed)
                        const maxTmp = Math.max(fixed)
                        if (min === 0 || minTmp < min) {
                            min = minTmp
                        }
                        if (max === 0 || maxTmp > max) {
                            max = maxTmp
                        }
                        obj.push(fixed)
                    })
                    graph.push({
                        label: item,
                        fill: true,
                        borderColor: color,
                        pointBackgroundColor: color,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        data: obj
                    })
                })

                const ctx = document.getElementById(c.id).getContext('2d')

                const config = {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: graph
                    },
                    options: {
                        elements: {
                            point: {
                                radius: 2
                            },
                            line: {
                                tension: 0,
                                fill: false,
                                steppedLine: false,
                                borderDash: []
                            }
                        },
                        animation: {
                            duration: 0
                        },
                        hover: {
                            animationDuration: 0
                        },
                        responsiveAnimationDuration: 0,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    maxTicksLimit: 10,
                                    fontSize: 15
                                },
                                display: true,
                                scaleLabel: {
                                    display: true
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true
                                },
                                ticks: {
                                    fontSize: 15,
                                    min: min,
                                    max: max,
                                    callback: function(value, index, values) {
                                        if (index === values.length - 1) return min.toFixed(5)
                                        else if (index === Math.trunc(values.length / 2)) {
                                            return ((max + min) / 2).toFixed(5)
                                        }
                                        else if (index === 0) return max.toFixed(5)
                                        else return ''
                                    }
                                }
                            }]
                        },
                        title: {
                            display: true,
                            text: c.labels.title,
                            fontSize: 20
                        },
                        maintainAspectRatio: !c.isMobile,
                        legend: {
                            position: 'top',
                            display: true
                        },
                        tooltips: {
                            callbacks: {
                                label(tooltipItem, data) {
                                    return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.yLabel}`
                                }
                            }
                        }
                    }
                }

                return {ctx: ctx, config: config} // eslint-disable-line no-new
            },
        }
    }
</script>