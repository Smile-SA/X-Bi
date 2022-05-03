import {goTo} from "../../../settings/utils";
import * as general from "../../../controller/genaralController";
import * as utils from "../../../settings/utils";
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "Card",
    components: {
        apexcharts: VueApexCharts,
    },
    props: ['configuration', 'from', 'to', 'queryBegin'],
    data() {
        return {
            timer: '',
            value: '-',
            sparkLine: {},
            sparkArea: {
                primary: {
                    chart: {
                        id: 'sparkArea1',
                        group: 'sparklines',
                        type: 'area',
                        height: 120,
                        sparkline: {
                            enabled: true
                        },
                        series: [{
                            name: 'purple',
                            data: [15, 75, 47, 65, 14, 32, 19, 54, 44, 61]
                        }],
                    },
                    yaxis: {
                        min: 0
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    fill: {
                        opacity: 1,
                    },
                    markers: {
                        size: 0
                    },
                    tooltip: {
                        fixed: {
                            enabled: true,
                            position: 'right'
                        },
                        x: {
                            show: false
                        }
                    },
                    title: {
                        text: '$135,965',
                        offsetX: 30,
                        style: {
                            fontSize: '20px',
                            cssClass: 'apexcharts-yaxis-title'
                        }
                    },
                    subtitle: {
                        text: 'Profits',
                        offsetX: 30,
                        style: {
                            fontSize: '14px',
                            cssClass: 'apexcharts-yaxis-title'
                        }
                    },
                    colors: ['var(--bs-primary)']
                },
                success: {
                    chart: {
                        id: 'sparkline1',
                        type: 'line',
                        height: 120,
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',
                        series: [{
                            name: 'purple',
                            data: [15, 75, 47, 65, 14, 32, 19, 54, 44, 61]
                        }],
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    markers: {
                        size: 0
                    },
                    tooltip: {
                        fixed: {
                            enabled: true,
                            position: 'right'
                        },
                        x: {
                            show: false
                        }
                    },
                    title: {
                        text: '439',
                        style: {
                            fontSize: '20px'
                        }
                    },
                    colors: ['var(--bs-success)']
                },
                warning: {
                    chart: {
                        id: 'sparkline1',
                        type: 'line',
                        height: 120,
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',
                        series: [{
                            name: 'purple',
                            data: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19]
                        }],
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    markers: {
                        size: 0
                    },
                    tooltip: {
                        fixed: {
                            enabled: true,
                            position: 'right'
                        },
                        x: {
                            show: false
                        }
                    },
                    title: {
                        text: '439',
                        style: {
                            fontSize: '20px'
                        }
                    },
                    colors: ['var(--bs-warning)']
                },
                danger: {
                    chart: {
                        id: 'sparkline1',
                        type: 'line',
                        height: 120,
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',
                        series: [{
                            name: 'purple',
                            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69]
                        }],
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    markers: {
                        size: 0
                    },
                    tooltip: {
                        fixed: {
                            enabled: true,
                            position: 'right'
                        },
                        x: {
                            show: false
                        }
                    },
                    title: {
                        text: '439',
                        style: {
                            fontSize: '20px'
                        }
                    },
                    colors: ['var(--bs-danger)']
                },
                purple: {
                    chart: {
                        id: 'sparkline1',
                        type: 'line',
                        height: 120,
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',
                        series: [{
                            name: 'purple',
                            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69]
                        }],
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    markers: {
                        size: 0
                    },
                    tooltip: {
                        fixed: {
                            enabled: true,
                            position: 'right'
                        },
                        x: {
                            show: false
                        }
                    },
                    title: {
                        text: '439',
                        style: {
                            fontSize: '20px'
                        }
                    },
                    colors: ['var(--bs-purple)']
                }
            }
        }
    },
    methods: {

        async getData() {
            await this.setQueryData();
            switch (this.configuration.type) {
                case "default":
                    await general.getJsonData(this.queryBegin + this.configuration.query + this.setQuery).then((r) => {
                        if (r.total > 0) {
                            switch (this.configuration.method) {
                                case "count":
                                    this.configuration.value = r.total;
                                    break;
                                case "sum":
                                    this.configuration.value = (r.results.length === 1) ?
                                        r.results[0][this.configuration.query_key].toFixed(2) :
                                        r.results.map(item => item[this.configuration.query_key]).reduce((a, b) => a + b, 0).toFixed(2)
                                    break;
                            }
                            this.$forceUpdate()
                        } else {
                            this.configuration.value = 0;
                            this.$forceUpdate()
                        }
                    });
                    break;
                case "line":
                    this.sparkLine.height = undefined;
                    await general.getSparkCardData(this.configuration, this).then(async (r) => {
                        if (r.total > 0) {
                            this.sparkLine = r;
                        }
                    });
                    break;
            }
        },

        async setQueryData() {
            this.setQuery = await utils.convertURLDateParameter(this.from, this.to)
            return this.setQuery;
        },
        redirectCard() {
            if (this.configuration.redirect !== '/') {
                goTo(this.configuration.redirect, this)
            }
        },

        // cardFetch() {
        //   const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
        //   return fetch(this.url + queryDate, {credentials: 'include'}).then(response => response.json())
        // },
        // fetchString() {
        //   this.cardFetch().then(r => this.value = r.results[0][this.configuration.key])
        //   this.$forceUpdate()
        // },
        // fetchSum() {
        //   this.cardFetch().then(r => {
        //     this.value = (r.results.length === 1) ?
        //         r.results[0][this.configuration.key].toFixed(2) :
        //         r.results.map(item => item[this.configuration.key]).reduce((a, b) => a + b, 0).toFixed(2)
        //     this.$forceUpdate()
        //   })
        // },
        // fetchAverrage() {
        //   this.cardFetch().then(r => {
        //     this.value = (r.results.map(item => item[this.configuration.key])
        //         .reduce((a, b) => a + b) / r.results.length)
        //         .toFixed(2)
        //     this.$forceUpdate()
        //   })
        // },
    },
    mounted() {
        this.getData(this.configuration.method);
    },
}