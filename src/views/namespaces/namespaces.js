import * as utils from '../../settings/utils'
import * as configurationsController from "../../controller/configurationsController";

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
            cardModels:{},
            cardStyle:{},
            chartModels:{},
            chartStyle:{},
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {
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
        showDatePicker() {
            return this.activeNamespace !== null
        },
        showGroup() {
            return this.activeNamespace !== null && this.date
        },
        async drawCards() {
            const r = configurationsController.getCardModels(this.$route.name)
            if (r.errors !== true) {
                if (r.data.total > 0) {
                    this.cardModels = r.data.results
                    if(this.activeNamespace!==null){
                        await Object.keys(this.cardModels).map((item) => {
                            this.cardModels[item].queryBegin = '/namespaces/' + this.activeNamespace;
                        })
                    }
                }
            } else {
                this.cardModels = {};
            }

        },
        async drawCharts() {
            let r = configurationsController.getChartModels(this.$route.name)
            if (r.data.errors !== true) {
                if (r.data.total > 0) {
                    this.chartModels = r.data.results;
                    if(this.activeNamespace!==null){
                        await Object.keys(this.chartModels).map((item) => {
                            this.chartModels[item].queryBegin = '/namespaces/' + this.activeNamespace;
                        })
                    }
                    let style = configurationsController.getChartStyles(this.$route.name)
                    if (style.data.errors !== true) {
                        this.chartStyle = null
                        this.chartStyle = style.data.results;
                    }
                }
            } else {
                this.chartModels = {};
            }
        },
        async setNamespaces(namespace) {
            this.activeNamespace = namespace.target.value
            this.setDate(this.date)
        },
        async setDate(date) {
            if (date) {
                this.cardModels = this.chartModels = this.chartStyle = this.cardStyle = {};
                this.date = date
                await utils.refreshDate(this.date, this);
            }
        },

    },
    async beforeMount() {
        this.namespaces = (await utils.fetchData(`/namespaces`)).map(item => item.namespace);
    },
    async mounted() {
    }
}