//import * as utils from  '../../../settings/utils'
import {goTo} from "../../../settings/utils";
import * as general from "../../../controller/genaralController";
import * as utils from "../../../settings/utils";

export default {
    name: "Card",
    props: ['configuration', 'from', 'to'],
    watch: {},
    data() {
        return {
            timer: '',
            value: '-',
        }
    },
    computed: {},
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            await this.setQueryData();
            let execute;
            switch (this.configuration.type) {
                case "count":
                    execute = this.doTheCount;
                    break;
                case "sum":
                    execute = this.doTheSum;
                    break;
                // case "sum": execute = this.fetchSum; break;
                // case "avg": execute = this.fetchAverrage; break;
            }
            await execute();
        },
        async doTheCount() {
            let queryBegin="";
            if(this.configuration.queryBegin!==undefined){
                queryBegin = this.configuration.queryBegin;
            }
            await general.getJsonData(queryBegin + this.configuration.query + this.setQuery).then((r) => {
                if (r.total > 0) {
                    this.configuration.value = r.total;
                    this.$forceUpdate()
                } else {
                    this.configuration.value = 0;
                    this.$forceUpdate()
                }
            })
        },
        async doTheSum() {
            let queryBegin="";
            if(this.configuration.queryBegin!==undefined){
                queryBegin = this.configuration.queryBegin;
            }
            await general.getJsonData(queryBegin + this.configuration.query + this.setQuery).then( (r) => {
                if (r.total > 0) {
                    this.configuration.value = (r.results.length === 1) ?
                        r.results[0][this.configuration.key].toFixed(2) :
                        r.results.map(item => item[this.configuration.key]).reduce((a, b) => a + b, 0).toFixed(2)
                    this.$forceUpdate()
                } else {
                    this.configuration.value = 0;
                }
            })
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
}