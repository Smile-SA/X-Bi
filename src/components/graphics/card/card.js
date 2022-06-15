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
            lstm:{}
        }
    },
    methods: {

        async getData() {
            await this.setQueryData();
            switch (this.configuration.type) {
                case"default" :
                case"multi-icon":
                    this.lstm = {}
                    await general.getJsonData(this.queryBegin + this.configuration.query + this.setQuery,this.configuration.method).then((r) => {
                        if (r.total > 0) {
                            switch (this.configuration.method) {
                                case "count":
                                    this.configuration.value = r.total;
                                    break;
                                case "sum":
                                    this.configuration.value = (r.results.length >= 1) ?
                                        r.results[0][this.configuration.query_key].toFixed(2) :
                                        r.results[0].map(item => item[this.configuration.query_key]).reduce((a, b) => a + b, 0).toFixed(2)
                                    break;
                                case "lstm":
                                    this.configuration.value = (r.results[this.configuration.query_key]).toFixed(2)
                                    this.configuration.icon = 'fa-arrow-'+(r.results.trend).toLowerCase()
                                    this.lstm = r.results
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
            if(this.configuration.method!='lstm'){
                this.setQuery = await utils.convertURLDateParameter(this.from, this.to)
            }else this.setQuery="";
            return this.setQuery;
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