import * as general from "../../../controller/genaralController";
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "Card",
    components: {
        apexcharts: VueApexCharts,
    },
    props: ['configuration', 'from', 'to', 'queryBegin', 'styles'],
    data() {
        return {
            timer: '',
            value: '-',
            sparkLine: {},
            lstm: {}
        }
    },
    methods: {

        async getData() {
            await this.setQueryData();
            switch (this.configuration.type) {
                case"default" :
                case"multi-icon":
                    this.lstm = {}
                    await general.getJsonData(this.queryBegin + this.configuration.query + this.setQuery, this.configuration.method).then((r) => {
                        if (r.total > 0) {
                            switch (this.configuration.method) {
                                case "avg":
                                    this.configuration.value = (r.results.map(item => item[this.configuration.query_key])
                                        .reduce((a, b) => a + b) / r.results.length)
                                        .toFixed(2)
                                    break;
                                case "count":
                                    this.configuration.value = r.total;
                                    break;
                                case "lstm":
                                    this.configuration.value = (r.results[this.configuration.query_key]).toFixed(2)
                                    this.configuration.icon = 'fa-arrow-' + (r.results.trend).toLowerCase()
                                    this.lstm = r.results
                                    break;
                                case "sum":
                                    this.configuration.value = (r.results.length >= 1) ?
                                        r.results[0][this.configuration.query_key].toFixed(2) :
                                        r.results[0].map(item => item[this.configuration.query_key]).reduce((a, b) => a + b, 0).toFixed(2)
                                    break;
                            }
                            this.$forceUpdate()
                        } else {
                            this.configuration.value = 0;
                            this.$forceUpdate()
                        }
                    });
                    break;
                case "chart":
                    this.sparkLine.height = undefined;
                    await general.getDataByVariableAndDateToApex(this.configuration, this).then(async (r) => {
                        if (r.total > 0) {
                            this.sparkLine = r;
                            this.sparkLine.options.chart.type = "line";
                        }
                    });
                    await general.getJsonData(this.queryBegin + this.configuration.query + this.setQuery, this.configuration.method).then((r) => {
                        if (r.total > 0) {
                            switch (this.configuration.method) {
                                case "avg":
                                    this.configuration.value = (r.results.map(item => item[this.configuration.query_key])
                                        .reduce((a, b) => a + b) / r.results.length)
                                        .toFixed(2)
                                    break;
                                case "count":
                                    this.configuration.value = r.total;
                                    break;
                                case "lstm":
                                    this.configuration.value = (r.results[this.configuration.query_key]).toFixed(2)
                                    this.configuration.icon = 'fa-arrow-' + (r.results.trend).toLowerCase()
                                    this.lstm = r.results
                                    break;
                                case "sum":
                                    this.configuration.value = (r.results.length >= 1) ?
                                        r.results[0][this.configuration.query_key].toFixed(2) :
                                        r.results[0].map(item => item[this.configuration.query_key]).reduce((a, b) => a + b, 0).toFixed(2)
                                    break;
                            }
                            this.$forceUpdate()
                        } else {
                            this.configuration.value = 0;
                            this.$forceUpdate()
                        }
                    });
                    break;
            }
            this.configuration.value = (this.configuration.value).toString()
        },

        async setQueryData() {
            if (this.configuration.method != 'lstm') {
                this.setQuery = await general.convertURLDateParameter(this.from, this.to)
            } else this.setQuery = "";
            return this.setQuery;
        },


    },
    beforeMount() {
        this.getData(this.configuration.method);
    },
}