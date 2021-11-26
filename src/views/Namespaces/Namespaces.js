import {generateAPIUrl} from '../../variables'
import * as utils from '../../utils'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
    components: {
        BarChart: () => import('../../components/charts/BarChart'),
        Card: () => import('../../components/include/card/index.vue'),
        ApexCharts: () => import ('../../components/apexCharts/index.vue'),
    },
    data() {
        return {
            metricsSeries: null,
            metricsOptions: null,
            metricsHeight: 0,
            barChartMetrics: null,
            pieChartNodesPods: null,
            selectForm: null,
            activeNamespace: null,
            colors: {},
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {
        isMobile() {
            return (window.innerWidth <= 800 && window.innerHeight <= 600)
        },
        confCardNodes() {
            return {
                from: this.from,
                to: this.to,
                link: '/nodes',
                label: 'Nodes',
                color: 'primary',
                icon: 'far fa-lightbulb',
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
                icon: 'fab fa-cloudversify',
                type: 'number'
            }
        },
        confCardRating() {
            const from = dateformat(this.from, 'dd/mm/yyyy')
            const to = dateformat(this.to, 'dd/mm/yyyy')
            return {
                from: this.from,
                to: this.to,
                link: '/',
                label: 'Rating',
                color: 'warning',
                icon: 'fa fa-euro-sign',
                message: ` from ${from} to ${to}`,
                type: 'sum',
                key: 'frame_price'
            }
        },
    },
    methods: {
        getCardRatingUrl() {
            return `${api}/namespaces/${this.activeNamespace}/total_rating`
        },
        getCardNodesUrl() {
            return `${api}/namespaces/${this.activeNamespace}/nodes`
        },
        getCardPodsUrl() {
            return `${api}/namespaces/${this.activeNamespace}/pods`
        },
        getURL(data) {
            utils.getURL(data, this)
        },
        refreshMetrics() {
            this.metricsSeries = []
            utils.fetchDataAsJSON(`${api}/namespaces/${this.activeNamespace}/rating`, this).then((value) => {
                if (value.total > 0) {
                    let c = {
                        graph: this.barChartMetrics,
                        id: 'barChartMetrics',
                        sort: 'metric',
                        colors: this.colors,
                        labels: {
                            time: 'frame_begin',
                            value: 'frame_price',
                            title: 'Metrics rate (in Euros)'
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
                        this.metricsSeries.push({
                            name: item,
                            data: obj
                        });
                        this.metricsOptions = {
                            chart: {
                                id: c.id, type: 'area'
                            },
                            xaxis: {
                                categories: labels,
                            },
                            dataLabels: {
                                enabled: false
                            },

                            title: {
                                text: c.labels.title,
                                style: {
                                    fontSize: '20px',
                                },
                            }
                        };
                        this.metricsHeight = 350;
                    })
                }
            });
        },

        refreshDate(date) {
            utils.refreshDate(date, this);
            this.refreshMetrics()
        },
        showDatePicker() {
            return this.activeNamespace !== null
        },
        async getNamespaces(namespace) {
            this.activeNamespace = namespace.target.value
            this.refreshDate(null)
            this.test = 1;
        },
        async generateColor() {
            this.colors = await utils.generateColor([
                {'endpoint': `${api}/metrics`, 'key': 'metric'},
                {'endpoint': `${api}/nodes`, 'key': 'node'}
            ], this)
        },
    },
    async beforeMount() {
        await this.generateColor()
        this.selectForm = (await utils.fetchData(`${api}/namespaces`, this)).map(item => item.namespace)
    },
    async mounted() {
    }
}