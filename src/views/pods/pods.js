import {generateAPIUrl} from '../../settings/variables'
import * as utils from '../../settings/utils'
import dateformat from 'dateformat'
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
            podsMetrics: {},
            date: null,
            selectPods: null,
            activePod: null,
            colors: {},
            to: new Date().toISOString(),
            confCardNameSpaces: {
                from: this.from,
                to: this.to,
                link: '/namespaces',
                label: 'Namespace',
                key: 'namespace',
                colorLabel: 'success',
                icon: 'mdi mdi-share-variant',
                type: 'number',
                color: '#0cceb0',
                value: 0,
            },
            confCardNodes: {
                from: this.from,
                to: this.to,
                link: '/nodes',
                label: 'Node',
                key: 'node',
                colorLabel: 'warning',
                type: 'string',
                color: '#fed60a',
                value: 0,
                icon: 'mdi mdi-server',

            },
            confCardRatings: {
                from: this.from,
                to: this.to,
                link: '/',
                label: 'Rating',
                colorLabel: 'danger',
                color: '#fe7c96',
                value: 0,
                icon: 'mdi mdi-currency-eur',
                type: 'sum',
                key: 'frame_price',
                message: `${dateformat(this.from, 'dd/mm/yyyy')} to ${dateformat(this.to, 'dd/mm/yyyy')}`,
            },
            confCardStart:{
                from: this.from,
                to: this.to,
                label: 'Started at',
                link: '/',
                icon: 'mdi mdi-calendar-today',
                type: 'string',
                key: 'start',
                colorLabel: 'dark',
                color: '#6c757d',
                value: 0,
            },
            confCardEnd:{
                from: this.from,
                to: this.to,
                colorLabel: 'dark',
                color: '#6c757d',
                link: '/',
                label: 'Last update',
                icon: 'mdi mdi-calendar',
                type: 'string',
                key: 'end',
                value: 0,
            },
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {
        isMobile() {
            return (window.innerWidth <= 800 && window.innerHeight <= 600)
        },
        confChartPodsMetrics() {
            return {
                id: 'barChartMetrics',
                type: 'line',
                height: 350,
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
        getCardLifetimeUrl() {
            return `${api}/pods/${this.activePod}/lifetime`
        },
        getPodsMetricsToApex() {
            this.podsMetrics.height = undefined;
            genaralController.getJsonDataToApex(`${api}/pods/${this.activeNode}/rating`, this.confChartPodsMetrics, this).then(async (r) => {
                if (r.total > 0) {
                    this.podsMetrics = r;
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
            return this.activePod !== null
        },
        async getMetrics() {
            return await utils.get(`${api}/pods/${this.activePod}/rating`, this)
        },
        async getPods(pod) {
            this.activePod = pod.target.value
            this.refreshDate(null)
        },
        async drawCards() {
            await genaralController.getJsonData('/pods/' + this.activePod + '/total_rating').then(async (r) => {
                this.confCardRatings.value = (r.results.length === 1) ?
                    r.results[0][this.confCardRatings.key].toFixed(2) :
                    r.results.map(item => item[this.confCardRatings.key]).reduce((a, b) => a + b, 0).toFixed(2)
            });
            await genaralController.getJsonData('/pods/' + this.activePod + '/nodes').then(async (r) => {
                this.confCardNodes.value = r.total;
            });
            await genaralController.getJsonData('/pods/' + this.activePod + '/namespaces').then(async (r) => {
                this.confCardNameSpaces.value = r.total;
            });
            await genaralController.getJsonData('/pods/' + this.activePod + '/namespaces').then(async (r) => {
                this.confCardStart.value = r.results[0][this.confCardStart.key]
            });
        },
        async drawGraphs() {
            //wait this.getPodsMetricsToApex();
        },
    },
    async beforeMount() {
        this.selectPods = (await utils.fetchData(`${api}/pods`)).map(item => item.pod);

    },
    async mounted() {
    }
}