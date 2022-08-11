import * as configurationsController from "../../controller/configurationsController";
import * as genaralController from "../../controller/genaralController";
import * as utils from "../../settings/utils";

export default {
    data() {
        return {
            group: 'hour',
            groupOptions: ['hour', 'day', 'month', 'year'],
            queryBegin: "",
            to: null,
            from: null,
            date: null,
            hover: true,
            queryLink: '',
            active: null,
            dynamicData: [],
            select: {
                models: {},
                styles: {}
            },
            structure: {
                card: {
                    models: {},
                    styles: {}
                },
                chart: {
                    models: {},
                    styles: {}
                }
            }
        }
    },
    methods: {
        showDatePicker() {
            return this.active !== null
        },
        showGroup() {
            return this.active !== null && this.date !== null
        },
        async setDynamicDataSelect(input) {
            this.active = input.target.value;
            this.queryBegin = this.queryLink + '/' + this.active;
            this.setDate(this.date);
        },
        async setDate(date) {
            if (date) {
                this.date = date;
                await this.setModelsData();
                await configurationsController.refreshDate(this.date, this);
            }
        },
        async setGroup(event) {
            this.group = event.target.value;
            this.setDate(this.date)
        },
        setModelsData() {
            this.structure.card = {
                models: {},
                styles: {}
            }
            this.structure.chart = {
                models: {},
                styles: {}
            }
        },
        getStructureModelsData() {
            let r = configurationsController.getSelectModels(this.$route.name)
            if (r.data != null && r.data.errors !== true) {
                if (r.data.total > 0) {
                    this.select.models = r.data.results;
                }
            } else {
                this.select.models = {};
                this.select.styles = {};
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
        async getDynamicSelectData() {
            let hasDynamicSelect = false
            this.select = {}
            await this.getStructureModelsData();
            if (this.select.models != undefined && Object.keys(this.select.models).length > 0) {
                await Object.keys(this.select.models).map((key) => {
                    if (this.select.models[key].type === 'dynamic') {
                        hasDynamicSelect = true;
                        this.queryLink = this.select.models[key].query;
                        genaralController.getJsonData(this.select.models[key].query).then((r) => {
                            if (r.total > 0) {
                                this.dynamicData = r.results
                            } else {
                                this.dynamicData = []
                            }
                        })
                    }
                })
            }
            console.log()
            if (!hasDynamicSelect) {
                this.active = true;
            }
        },
    },
    beforeMount() {
        this.active = this.date = null;
        this.getDynamicSelectData();
        this.setModelsData();
        //if (this.$route.name === 'Overall') {
            this.date = this.setDefaultDate(1)
            this.setDate(this.date);
            this.active = 'active';
        //}
        utils.titleBoxRender(this)
    },
    watch: {
        // eslint-disable-next-line no-unused-vars
        async $route(to, from) {
            utils.titleBoxRender(this)
            this.active = this.date = null;
            await this.getDynamicSelectData();
            await this.setModelsData();
            if (this.$route.name === 'Overall') {
                this.date = this.setDefaultDate(1)
                this.setDate(this.date);
                this.active = 'active';
            }
        }
    },
}


