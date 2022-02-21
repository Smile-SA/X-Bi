import * as utils from '@/settings/utils'
import * as configurationsController from "@/controller/configurationsController";

export default {
    components: {},
    data() {
        return {
            date: null,
            to: null,
            from: null,
            node: {},
            group: 'Hour',
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            queryBegin:"",
            cardModels: {},
            chartModels: {},
            chartStyle: {},
            cardStyle: {},
        }
    },
    computed: {},
    methods: {
        showGroup() {
            return this.date !== null
        },

        async drawCards() {
            let r = configurationsController.getCardModels(this.$route.name)
            if (r.data.errors !== true) {
                if (r.data.total > 0) {
                    this.cardModels = r.data.results;
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
        setDefaultDate(jour, month, year) {
            var e = new Date, n, a = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()));
            if (jour > 0) {
                n = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate() - jour))
            }
            if (month > 0) {
                n = new Date(Date.UTC(e.getFullYear(), e.getMonth() - month, e.getDate()))
            }
            if (year > 0) {
                n = new Date(Date.UTC(e.getFullYear() - year, e.getMonth(), e.getDate()))
            }
            return {start: n, end: a}
        },
        async setDate(date) {
            this.cardModels = this.chartModels = this.chartStyle = this.cardStyle = {};
            this.date = date
            await utils.refreshDate(this.date, this);
        },
        async setGroup(event){
            this.group = event.target.value;
            this.setDate(this.date)
        }
    },
    async beforeMount() {
        this.date = this.setDefaultDate(1)
        this.setDate(this.date);
    },
}
