<template>
    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" :id="idL" :height="height" :dump="JSON.stringify(currentDateRange)"></canvas>
</template>

<script>
    import * as utils from "../../utils";
    import Chart from "chart.js";

    export default {
        name: "LineChart",
        props: ['idL', 'height', 'configuration', 'dateRange', 'getData'],
        data() {
            return {
                chart: null,
                to: new Date().toISOString(),
                from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                oldDateRange: null,
            }
        },
        async mounted() {
            const date = this.currentDateRange;
            if (date !== null) {
                this.from = date.start.toISOString().split('.')[0] + '.000Z'
                if (date.end === null || date.start === date.end) {
                    date.end = new Date(this.from)
                    date.end.setDate(date.end.getDate() + 1)
                }
                this.to = date.end.toISOString().split('.')[0] + '.000Z'
                this.to = this.to.replace('T', ' ')
                this.from = this.from.replace('T', ' ')
            }
            this.drawLineChart(this.configuration);
        },
        beforeUpdate() {
          if (this.oldDateRange == this.dateRange) {
              return;
          }
            const date = this.currentDateRange;
            if (date !== null) {
                this.from = date.start.toISOString().split('.')[0] + '.000Z'
                if (date.end === null || date.start === date.end) {
                    date.end = new Date(this.from)
                    date.end.setDate(date.end.getDate() + 1)
                }
                this.to = date.end.toISOString().split('.')[0] + '.000Z'
                this.to = this.to.replace('T', ' ')
                this.from = this.from.replace('T', ' ')
            }
            this.drawLineChart(this.configuration);
        },
        computed: {
             currentDateRange() {
                 this.oldDateRange = this.oldDateRange;
                return this.dateRange;
            }
        },
        methods: {
            clicked(data) {
                this.selected = data.target.id
            },
            generateLineGraph(response, c) {
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
                    const color = c.context.colors[item]
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
                        maintainAspectRatio: !c.context.isMobile,
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
            async drawLineChart(c) {
                if (this.chart !== null) {
                    this.chart.destroy()
                }
                if (!c || !c.url) {
                    return;
                }

                const {total, results} = await this.getData();
                if (total === 0) {
                    return this.chart
                }
                const {ctx, config} = this.generateLineGraph(results, c)

                this.chart = new Chart(ctx, config)
            }
        }
    }
</script>

<style scoped>

</style>