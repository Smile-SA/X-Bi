import {goTo} from "../../../settings/utils";
import * as general from "../../../controller/genaralController";
import * as utils from "../../../settings/utils";
import VueApexCharts from 'vue-apexcharts'

export default {
    name: "Card",
    components: {
        apexcharts: VueApexCharts,
    },
    props: ['configuration', 'from', 'to', 'queryBegin'],
    data() {
        return {
            timer: '',
            value: '-',
            sparkLine: {},
        }
    },
    methods: {

        async getData() {
            await this.setQueryData();
            switch (this.configuration.type) {
                case"default" :
                case"multi-icon":
                    await general.getJsonData(this.queryBegin + this.configuration.query + this.setQuery).then((r) => {
                        if (r.total > 0) {
                            switch (this.configuration.method) {
                                case "count":
                                    this.configuration.value = r.total;
                                    break;
                                case "sum":
                                    this.configuration.value = (r.results.length === 1) ?
                                        r.results[0][this.configuration.query_key].toFixed(2) :
                                        r.results.map(item => item[this.configuration.query_key]).reduce((a, b) => a + b, 0).toFixed(2)
                                    break;
                            }
                            this.$forceUpdate()
                        } else {
                            this.configuration.value = 0;
                            this.$forceUpdate()
                        }
                    });
                    break;
                case "spark":
                    this.sparkLine.height = undefined;
                    await general.getSparkCardData(this.configuration, this).then(async (r) => {
                        if (r.total > 0) {
                            this.sparkLine = r;
                            this.sparkLine.options.chart.type = "line";
                        }
                    });
                    break;
            }
            this.configuration.value = (this.configuration.value).toString()
        },

        async setQueryData() {
            this.setQuery = await utils.convertURLDateParameter(this.from, this.to)
            return this.setQuery;
        },
        redirectCard() {
            if (this.configuration.redirect !== '/') {
                goTo(this.configuration.redirect, this)
            }
        },

        // cardFetch() {
        //   const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
        //   return fetch(this.url + queryDate, {credentials: 'include'}).then(response => response.json())
        // },
        // fetchString() {
        //   this.cardFetch().then(r => this.value = r.results[0][this.configuration.key])
        //   this.$forceUpdate()
        // },
        // fetchSum() {
        //   this.cardFetch().then(r => {
        //     this.value = (r.results.length === 1) ?
        //         r.results[0][this.configuration.key].toFixed(2) :
        //         r.results.map(item => item[this.configuration.key]).reduce((a, b) => a + b, 0).toFixed(2)
        //     this.$forceUpdate()
        //   })
        // },
        // fetchAverrage() {
        //   this.cardFetch().then(r => {
        //     this.value = (r.results.map(item => item[this.configuration.key])
        //         .reduce((a, b) => a + b) / r.results.length)
        //         .toFixed(2)
        //     this.$forceUpdate()
        //   })
        // },
    },
    beforeMount() {
        this.getData(this.configuration.method);
    },
}