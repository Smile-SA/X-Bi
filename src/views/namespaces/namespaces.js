import * as utils from '@/settings/utils'
import * as configurationsController from "@/controller/configurationsController";

export default {
    components: {

    },
    data() {
        return {
            group: 'Hour',
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            queryBegin:"",
            to: null,
            from: null,
            date: null,
            active: null,
            namespaces: null,
            cardStyle:{},
            cardModels:{},
            chartStyle:{},
            chartModels:{}
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
            return this.active !== null
        },
        showGroup() {
            return this.active !== null && this.date
        },
        async drawCards() {
            const r = configurationsController.getCardModels(this.$route.name)
            if (r.errors !== true) {
                if (r.data.total > 0) {
                    this.cardModels = r.data.results
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
            this.active = namespace.target.value
            this.queryBegin = '/namespaces/' + this.active;

            this.setDate(this.date)
        },
        async setDate(date) {
            if (date) {
                this.cardModels = this.chartModels = this.chartStyle = this.cardStyle = {};
                this.date = date
                await utils.refreshDate(this.date, this);
            }
        },
        async setGroup(event){
            this.group = event.target.value;
            this.setDate(this.date)
        }

    },
    async beforeMount() {
        this.namespaces = (await utils.fetchData(`/namespaces`)).map(item => item.namespace);
    },
    async mounted() {
    }
}