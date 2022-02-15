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
            pods: null,
            activePod: null,
            cardModels: {},
            chartModels: {},
            chartStyle: {},
            cardStyle: {},
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
            from: null, to: null,

        }
    },
    computed: {},
    methods: {
        showGroup() {
            return this.activePod !== null && this.date !== null
        },
        showDatePicker() {
            return this.activePod !== null
        },
        async setPod(pod) {
            this.activePod = pod.target.value
            this.setDate(this.date)
        },
        async drawCards() {
            const r = configurationsController.getCardModels(this.$route.name)
            if (r.errors !== true) {
                if (r.data.total > 0) {
                    this.cardModels = r.data.results
                    if (this.activePod !== null) {
                        await Object.keys(this.cardModels).map((item) => {
                            this.cardModels[item].queryBegin = '/pods/' + this.activePod;
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
                    if (this.activePod !== null) {
                        await Object.keys(this.chartModels).map((item) => {
                            this.chartModels[item].queryBegin = '/pods/' + this.activePod;
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
        setDate(date) {
            if (date !== null) {
                this.cardModels = this.chartModels = this.chartStyle = this.cardStyle = {};
                this.date = date;
                let s = new Date(date.start), e = new Date(date.end),
                    options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                this.confCardStart.value = s.toLocaleDateString("en-US", options) + " " + s.toLocaleTimeString()
                this.confCardEnd.value = e.toLocaleDateString("en-US", options) + " " + e.toLocaleTimeString()

                utils.refreshDate(date, this);
            }
        },
    },
    async beforeMount() {
        this.pods = (await utils.fetchData('/pods')).map(item => item.pod);
    },
    async mounted() {
    }
}