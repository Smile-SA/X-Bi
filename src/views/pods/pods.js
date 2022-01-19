import * as utils from '../../settings/utils'
import dateformat from 'dateformat'
import * as genaralController from "../../controller/genaralController";

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
            podsMetrics: {},
            date: null,
            pods: null,
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
                type: 'number',
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
                type: 'number',
                key: 'frame_price',
                message: `${dateformat(this.from, 'dd/mm/yyyy')} to ${dateformat(this.to, 'dd/mm/yyyy')}`,

            },
            confCardStart: {
                label: 'Started at',
                link: '/',
                icon: 'mdi mdi-calendar-today',
                type: 'date',
                colorLabel: 'dark',
                color: '#6c757d',
                value: '',
            },
            confCardEnd: {
                colorLabel: 'dark',
                color: '#6c757d',
                link: '/',
                label: 'Ended at',
                icon: 'mdi mdi-calendar',
                type: 'date',
                value: '',
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
            return '/pods/' + this.activePod + '/lifetime'
        },
        getPodsMetricsToApex() {
            this.podsMetrics.height = undefined;
            genaralController.getDataByVariableAndDateToApex('/pods/' + this.activePod + '/rating', this.confChartPodsMetrics, this).then(async (r) => {
                if (r.total > 0) {
                    this.podsMetrics = r;
                }
            });
        },
        setDate(date) {
            if (date !== null) {
                this.date = date;
                let s = new Date(date.start), e = new Date(date.end),
                    options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                this.confCardStart.value = s.toLocaleDateString("en-US", options) + " " + s.toLocaleTimeString()
                this.confCardEnd.value = e.toLocaleDateString("en-US", options) + " " + e.toLocaleTimeString()
                utils.refreshDate(date, this);
            }
        },
        showGroup() {
            return this.activeNode !== null && this.date !== null
        },
        showDatePicker() {
            return this.activePod !== null
        },
        async getMetrics() {
            return await utils.get('/pods/' + this.activePod + '/rating', this)
        },
        async setPod(pod) {
            this.activePod = pod.target.value
            this.setDate(this.date)
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
        },
        async drawGraphs() {
            await this.getPodsMetricsToApex();
        },
    },
    async beforeMount() {
        this.pods = (await utils.fetchData('/pods')).map(item => item.pod);
    },
    async mounted() {
    }
}