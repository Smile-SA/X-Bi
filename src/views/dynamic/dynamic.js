import * as configurationsController from "../../controller/configurationsController";
import * as genaralController from "../../controller/genaralController";
import * as general from "../../controller/genaralController";


export default {
    data() {
        return {
            group: 'hour',
            groupOptions: ['hour', 'day', 'month', 'year'],
            queryData: {},
            dynamicDataSelectId: '',
            queryLink: '',
            additionalUrl: '',
            to: null,
            from: null,
            date: null,
            active: null,
            hover: true,
            apiInfo: undefined,
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
            return this.date !== null && this.active !== null
        },
        // eslint-disable-next-line no-unused-vars
        async setDynamicDataSelect(input, id) {
            this.active = input.target.value;
            if (this.apiInfo.mode === "ro") {
                this.additionalUrl = id + '/' + this.active;
            } else {
                this.additionalUrl = ""
                this.queryData[id] = this.active;
            }
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
        todayFunction() {
            const n = new Date()
            const startToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1, 0, 0)
            const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 0, 23, 59)
            return {
                start: startToday,
                end: endToday
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
            this.active = null;
            let hasDynamicSelect = false
            this.select = {}
            await this.getStructureModelsData();
            if (this.select.models != undefined && Object.keys(this.select.models).length > 0) {
                await Object.keys(this.select.models).map((key) => {
                    if (this.select.models[key].type === 'dynamic') {
                        hasDynamicSelect = true;
                        this.queryLink = this.select.models[key].query;
                        genaralController.getJsonData(this.select.models[key]).then((r) => {
                            if (r.total > 0) {
                                this.dynamicData = r.results
                            } else {
                                this.dynamicData = []
                            }
                        })
                    }
                })
            }
            if (!hasDynamicSelect) {
                this.active = true;
            }
        },
    },
    beforeMount() {
        this.date = this.to = this.from = this.active = null
        this.queryData = {}
        this.dynamicData = []
        this.hover = true, this.dynamicDataSelectId = this.queryLink = this.additionalUrl = ''
        this.select = {
            models: {},
            styles: {}
        }
        this.structure = {
            card: {
                models: {},
                styles: {}
            },
            chart: {
                models: {},
                styles: {}
            }
        }
        this.apiInfo = configurationsController.getApiInfo()
        this.setModelsData()
        this.getDynamicSelectData()
        general.titleBoxRender(this)
        if (this.$route.name === 'Overall') {
            this.active = '';
            this.date = this.todayFunction()
            this.setDate(this.date);
        }
    },
    watch: {
        $route() {
            this.date = this.to = this.from = this.active = null
            this.queryData = {}
            this.dynamicData = []
            this.hover = true, this.dynamicDataSelectId = this.queryLink = this.additionalUrl = ''
            this.select = {
                models: {},
                styles: {}
            }
            this.structure = {
                card: {
                    models: {},
                    styles: {}
                },
                chart: {
                    models: {},
                    styles: {}
                }
            }
            this.apiInfo = configurationsController.getApiInfo()
            general.titleBoxRender(this)
            this.getDynamicSelectData();
            this.setModelsData();
            if (this.$route.name === 'Overall') {
                this.active = '';
                this.date = this.todayFunction()
                this.setDate(this.date);
            }
        }
    },
}


