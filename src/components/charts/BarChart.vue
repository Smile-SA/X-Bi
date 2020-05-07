<template>
    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" :id="idL" :height="height" :titre=dataS.toString()></canvas>
</template>

<script>
    import BaseChart from "./BaseChart";
    import * as utils from "../../utils";

    export default {
        name: "BarChart",
        extends: BaseChart,
        props: ['idL', 'height', 'configuration', 'dataS'],
        methods: {
            graphConfiguration(response, c) {
                const ctx = document.getElementById(c.id).getContext('2d')

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
                        backgroundColor: color,
                        data: obj
                    })
                })
                const config = {
                    type: 'bar',
                    data: {
                        datasets: graph,
                        labels: labels
                    },
                    options: {
                        title: {
                            fontSize: 20,
                            display: true,
                            text: c.labels.title
                        },
                        scales: {
                            xAxes: [{
                                stacked: true,
                                ticks: {
                                    maxTicksLimit: 10
                                }
                            }],
                            yAxes: [{
                                stacked: true,
                                display: true,
                                scaleLabel: {
                                    display: true
                                },
                                ticks: {
                                    beginAtZero: true,
                                    fontSize: 15,
                                    callback: function(value, index, values) {
                                        if (index === values.length - 1) return min.toFixed(10)
                                        else if (index === Math.trunc(values.length / 2)) {
                                            return ((max + min) / 2).toFixed(10)
                                        }
                                        else if (index === 0) return max.toFixed(10)
                                        else return ''
                                    }
                                }
                            }]
                        },
                        responsive: true,
                        tooltips: {
                            intersect: false,
                            mode: 'label'
                        }
                    }
                }
                return {ctx: ctx, config: config} // eslint-disable-line no-new
            },
        }
    }
</script>