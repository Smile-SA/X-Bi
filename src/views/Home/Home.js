import {generateAPIUrl} from '../../variables'
import * as utils from '../../utils'

const api = generateAPIUrl()

export default {
    components: {
        Card: () => import('../../components/include/card/index.vue'),
        apexcharts: () => import ('../../components/apexCharts/index.vue'),
    },
    data() {
        return {
            date: null,
            lineChartNodes: null,
            donutSeries: null,
            donutOptions: null,
            chartSeries: null,
            apexChartOptions: {
                chart: {
                    id: 'vuechart-example', type: "line",
                },
            },
            nameSpaceSeries: null,
            nameSpaceOptions: null,
            nodeSeries: null,
            nodeHeight: 0,
            nameSpaceHeight: 0,
            nodeOptions: null,
            lineChartNamespaces: null,
            dateRange: null,
            colors: {},
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {
        isMobile() {
            return (window.innerWidth <= 800 && window.innerHeight <= 600)
        },
        confLineChartNodes() {
            return {
                id: 'lineChartNodes',
                sort: 'node',
                colors: this.colors,
                isMobile: this.isMobile,
                labels: {
                    time: 'frame_begin',
                    value: 'frame_price',
                    title: 'Nodes rate (in Euros)'
                }
            }
        },

        //card
        confCardNamespaces() {
            return {
                from: this.from,
                to: this.to,
                link: '/namespaces',
                label: 'Namespaces',
                color: 'primary',
                icon: 'slice-icon svg-inline--fa fa-w-16',
                type: 'number'
            }
        },
        confCardPods() {
            return {
                from: this.from,
                to: this.to,
                link: '/pods',
                label: 'Pods',
                color: 'success',
                icon: 'fa fa-sitemap',
                type: 'number'
            }
        },
        confCardNodes() {
            return {
                from: this.from,
                to: this.to,
                link: '/nodes',
                label: 'Nodes',
                color: 'warning',
                icon: 'fa fa-server',
                type: 'number'
            }
        },
        //
    },
    methods: {
        async getNodes() {
            return await utils.fetchDataAsJSON(`${api}/nodes/rating`, this);
        },

        getCardNamespacesUrl() {
            return `${api}/namespaces`
        },
        getCardPodsUrl() {
            return `${api}/pods`
        },
        getCardNodesUrl() {
            return `${api}/nodes`
        },
        clicked(data) {
            this.selected = data.target.id
        },
        async refreshDate(date) {
            this.dateRange = date;
            utils.refreshDate(date, this)
            await this.getPieData();
            await this.getNodesToApex();
            //await this.getNamespacesToApex();
        },
        async generateColor() {
            this.colors = await utils.generateColor([
                {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
                {'endpoint': `${api}/nodes`, 'key': 'node'},
            ], this)
        },
         getPieData() {
            this.donutSeries = [];
            let labels = [],colors = [];
             this.cardFetch(this.getCardNamespacesUrl()).then((value) => {
                this.donutSeries.push(value.total);
                labels.push('Namespaces');
                colors.push('#008ffb');
            });
             this.cardFetch(this.getCardNodesUrl()).then((value) => {
                this.donutSeries.push(value.total)
                labels.push('Nodes');
                colors.push('#feb019');
            });
             this.cardFetch(this.getCardPodsUrl()).then((value) => {
                this.donutSeries.push(value.total)
                labels.push('Pods');
                colors.push('#00e396');
            });
            this.donutOptions = {
                chart: {
                    type: 'donut',
                },
                colors: colors,
                labels: labels,
                legend: {
                    show: false
                }
            };
        },
         getNodesToApex() {
            this.nodeSeries = []
             utils.fetchDataAsJSON(`${api}/nodes/rating`, this).then((value) => {
                if (value.total>0) {
                    let c = {
                        id: 'lineChartNodes',
                        sort: 'node',
                        colors: this.colors,
                        isMobile: this.isMobile,
                        labels: {
                            time: 'frame_begin',
                            value: 'frame_price',
                            title: 'Nodes rate (in Euros)'
                        }
                    };
                    const dataset = utils.groupBy(value.results, c.sort);
                    const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

                    labels.forEach((item, count) => {
                        labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
                    })
                    let min = 0
                    let max = 0
                    Object.keys(dataset).forEach(item => {
                        const obj = []
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
                        this.nodeSeries.push({
                            name: item,
                            data: obj
                        });
                        this.nodeOptions = {
                            chart: {
                                id: c.id,type:'line'
                            },
                            xaxis: {
                                categories: labels,
                            },
                            title: {
                                text: c.labels.title,
                                style: {
                                    fontSize:  '20px',
                                },
                            }
                        };
                        this.nodeHeight = 350;

                    })
                }
            });
        },
         getNamespacesToApex() {
            this.nameSpaceSeries = []
             utils.fetchDataAsJSON(`${api}/namespaces/rating`, this).then((value) => {
                if (value.total>0) {
                    let c = {
                        id: 'lineChartNamespaces',
                        sort: 'namespace',
                        colors: this.colors,
                        isMobile: this.isMobile,
                        labels: {
                            time: 'frame_begin',
                            value: 'frame_price',
                            title: 'Slices rate (in Euros)'
                        }
                    };
                    const dataset = utils.groupBy(value.results, c.sort);
                    const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

                    labels.forEach((item, count) => {
                        labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
                    })
                    let min = 0
                    let max = 0
                    Object.keys(dataset).forEach(item => {
                        const obj = []
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
                        this.nameSpaceSeries.push({
                            name: item,
                            data: obj
                        });
                        this.nameSpaceOptions = {
                            chart: {
                                id: c.id,type:'line'
                            },
                            xaxis: {
                                type: 'time',
                                tickPlacement: 'on',
                                categories: labels,
                            },
                            title: {
                                text: c.labels.title,
                                style: {
                                    fontSize:  '20px',
                                },
                            }
                        };
                        this.nameSpaceHeight = 350;

                    })
                }
            });
        },

        //piecharts update
        cardFetch(url) {
            // node
            const queryDate = utils.convertURLDateParameter(this.from, this.to)
            return fetch(url + queryDate, {credentials: 'include'}).then(response => response.json())
        },
    },
    async beforeMount() {
        await this.generateColor()
    },
    async mounted() {
    }
}

