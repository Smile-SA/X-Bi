import * as utils from '../../settings/utils'
import * as controller from "../../controller/genaralController";

export default {
    components: {
        Card: () => import('../../components/Layout/card'),
        BarChart: () => import ('../../components/charts/charts.js/BarChart'),
        ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts'),
        GroupBy: () => import ('../../components/Layout/group/index'),
        DatePicker: () => import ('../../components/Layout/datePicker/index'),
        SelectOption: () => import ('../../components/Layout/selectOption/index'),
    },
    data() {
        return {
            group: 'Hour',
            date: null,
            barChartMetrics: {},
            namespaces: null,
            activeNamespace: null,
            confCardNodes: {
                from: this.from,
                to: this.to,
                link: '/nodes',
                label: 'Nodes',
                colorLabel: 'warning',
                icon: 'mdi mdi-server',
                type: 'number',
                color: '#fed60a',
                value: 0,
            },
            confCardPods: {
                from: this.from,
                to: this.to,
                link: '/pods',
                label: 'Pods',
                colorLabel: 'primary',
                icon: 'mdi mdi-sitemap',
                type: 'number',
                color: '#1eaae1',
                value: 0
            },
            confCardRating: {
                from: this.from,
                to: this.to,
                link: '/',
                label: 'Rating',
                colorLabel: 'danger',
                color: '#fe7c96',
                value: 0,
                icon: 'mdi mdi-currency-eur',
                type: 'number',
                key: 'frame_price'
            },
            colors: {},
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {
        isMobile() {
            return (window.innerWidth <= 800 && window.innerHeight <= 600)
        },

        confChartMetrics() {
            return {
                id: 'barChartMetrics',
                type: 'area',
                height: 450,
                fontSize: '20px',
                sort: 'metric',
                xaxis: {
                    type: 'datetime'
                },
                labels: {
                    time: 'frame_begin',
                    value: 'frame_price',
                    title: 'Metrics rate (in Euros)'
                }
            }
        },
        confChartNodesPods() {
            return {
                id: 'pieChartNodesPods',
                type: 'donut',
                height: 450,
                fontSize: '20px',
                sort: 'node',
                xaxis: {
                    type: 'datetime'
                },
                labels: {
                    time: 'frame_begin',
                    value: 'frame_price',
                    title: 'Services repartition by nodes'
                }
            }
        },
    },
    methods: {
        getBarChartMetrics() {
            this.barChartMetrics.height = undefined;
            controller.getDataByVariableAndDateToApex(`/namespaces/${this.activeNamespace}/rating`, this.confChartMetrics, this).then(async (r) => {
                if (r.total > 0) {
                    this.barChartMetrics = r;
                }
            });
        },
        setDate(date) {
            if (date!== null) {
                this.date = date;
                utils.refreshDate(date, this);
            }
        },
        showDatePicker() {
            return this.activeNamespace !== null
        },
        showGroup() {
            return this.activeNamespace !== null && this.date
        },
        async setNamespaces(namespace) {
            this.activeNamespace = namespace.target.value
            this.setDate(this.date)
        },
        async drawCards() {
            await controller.getJsonData('/namespaces/' + this.activeNamespace + '/total_rating').then(async (r) => {
                this.confCardRating.value = (r.results.length === 1) ?
                    r.results[0][this.confCardRating.key].toFixed(2) :
                    r.results.map(item => item[this.confCardRating.key]).reduce((a, b) => a + b, 0).toFixed(2)
            });
            await controller.getJsonData('/namespaces/' + this.activeNamespace + '/pods').then(async (r) => {
                this.confCardPods.value = r.total;
            });
            await controller.getJsonData('/namespaces/' + this.activeNamespace + '/nodes').then(async (r) => {
                this.confCardNodes.value = r.total;
            });
        },
        async drawGraphs() {
            await this.getBarChartMetrics()
        },
    },
    async beforeMount() {
        this.namespaces = (await utils.fetchData(`/namespaces`)).map(item => item.namespace);
    },
    async mounted() {
    }
}