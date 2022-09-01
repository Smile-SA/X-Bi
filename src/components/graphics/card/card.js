import * as general from "../../../controller/genaralController";
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "Card",
    components: {
        apexcharts: VueApexCharts,
    },
    props: ['configuration', 'queryData', 'styles', 'additionalUrl', 'group'],
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
            let lastValue = parseFloat(this.configuration.value).toFixed(2) > 0 ? this.configuration.value : 0
            switch (this.configuration.type) {
                case"default" :
                case"multi-icon":
                    this.lstm = {}
                    await general.getJsonData(this.configuration, this.additionalUrl, this.queryData)
                        .then((r) => {
                            if (r.total > 0) {
                                switch (this.configuration.method) {
                                    case "avg":
                                        this.configuration.value = (r.results.length > 0) ? (r.results.map(item => item[this.configuration.query_key])
                                            .reduce((a, b) => a + b) / r.results.length).toFixed(2) : lastValue
                                        break;
                                    case "count":
                                        this.configuration.value = r.results.length;
                                        break;
                                    case "lstm":
                                        this.configuration.value = (r.results[this.configuration.query_key]).toFixed(2)
                                        this.configuration.icon = 'fa-arrow-' + (r.results.trend).toLowerCase()
                                        this.lstm = r.results
                                        break;
                                    case "sum":
                                        this.configuration.value = (r.results.length <= 1) ?
                                            parseFloat(r.results[0][this.configuration.query_key]) : (r.results.length > 1) ?
                                                r.results.map(item => parseFloat(item[this.configuration.query_key])).reduce((a, b) => a + b, 0).toFixed(0) : lastValue
                                        break;
                                }
                                this.$forceUpdate()
                            } else {
                                this.configuration.value = lastValue;
                                this.$forceUpdate();
                            }
                        });
                    break;
                case "chart":
                    this.sparkLine.height = undefined;
                    await general.getDataByVariableAndDateToApex(this.configuration, this.additionalUrl, this.queryData, this.group, this.styles,).then(async (r) => {
                        if (r.total > 0) {
                            this.sparkLine = r;
                            this.sparkLine.options.chart.type = "line";
                        }
                    });
                    await general.getJsonData(this.configuration, this.additionalUrl, this.queryData).then((r) => {
                        if (r.total > 0) {
                            switch (this.configuration.method) {
                                case "avg":
                                    this.configuration.value = (r.results.length > 0) ? (r.results.map(item => item[this.configuration.query_key])
                                        .reduce((a, b) => a + b) / r.results.length)
                                        .toFixed(2) : lastValue
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
                                    this.configuration.value = (r.results.length < 1) ?
                                        r.results[0][this.configuration.query_key].toFixed(2) : (r.results.length > 1) ?
                                            r.results[0].map(item => item[this.configuration.query_key]).reduce((a, b) => a + b, 0).toFixed(2) : lastValue
                                    break;
                            }
                            this.$forceUpdate()
                        } else {
                            this.configuration.value = lastValue;
                            this.$forceUpdate()
                        }
                    });
                    break;
            }
            this.configuration.value = (this.configuration.value).toString()
        },
    },
    beforeMount() {
        this.getData(this.configuration.method);
    },
}