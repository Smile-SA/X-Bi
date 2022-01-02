import {generateAPIUrl} from '../../settings/variables'
import * as utils from '../../settings/utils'
import * as genaralController from "../../controller/genaralController";

const api = generateAPIUrl()

export default {
    components: {
        Card: () => import('../../components/Layout/card/index.vue'),
        BarChart: () => import ('../../components/charts/charts.js/BarChart'),
        ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts/index.vue'),
    },
    data() {
        return {
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            group: 'Day',
            date:null,
            metrics: {},
            barChartMetrics: null,
            pieChartNodesPods: null,
            selectForm: null,
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
                type: 'sum',
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
    },
    methods: {
        getMetricsToApex() {
            this.metrics.height = undefined;
            genaralController.getJsonDataToApex(`${api}/namespaces/${this.activeNamespace}/rating`, this.confChartMetrics, this).then(async (r) => {
                if (r.total > 0) {
                    this.metrics = r;
                }
            });
        },
        refreshDate(date) {
            this.date = date;
            utils.refreshDate(date, this);
        },
        refreshOptions(event) {
            this.group = event.target.value;
            this.refreshDate(this.date)
        },
        showDatePicker() {
            return this.activeNamespace !== null
        },
        async getNamespaces(namespace) {
            this.activeNamespace = namespace.target.value
            this.refreshDate(this.date)
            this.test = 1;
        },
        async drawCards() {
            await genaralController.getJsonData('/namespaces/' + this.activeNamespace + '/total_rating').then(async (r) => {
                this.confCardRating.value = (r.results.length === 1) ?
                    r.results[0][this.confCardRating.key].toFixed(2) :
                    r.results.map(item => item[this.confCardRating.key]).reduce((a, b) => a + b, 0).toFixed(2)
            });
            await genaralController.getJsonData('/namespaces/' + this.activeNamespace + '/pods').then(async (r) => {
                this.confCardPods.value = r.total;
            });
            await genaralController.getJsonData('/namespaces/' + this.activeNamespace + '/nodes').then(async (r) => {
                this.confCardNodes.value = r.total;
            });
        },
        async drawGraphs() {
            await this.getMetricsToApex()
        },
    },
    async beforeMount() {
        this.selectForm = (await utils.fetchData(`${api}/namespaces`)).map(item => item.namespace);
    },
    async mounted() {
    }
}