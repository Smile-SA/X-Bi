import * as utils from '../../settings/utils'

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
            queryBegin: "",
            structure: {
                select: {
                    models: {},
                    styles: {}
                },
                card: {
                    models: {},
                    styles: {}
                },
                chart: {
                    models: {},
                    styles: {}
                }

            },
        }
    },
    computed: {},
    methods: {
        showGroup() {
            return this.date !== null
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
            await this.setModelsData()
            this.date = date
            await utils.refreshDate(this.date, this);
        },
        async setGroup(event) {
            this.group = event.target.value;
            this.setDate(this.date)
        },
        setModelsData() {
            this.structure = {
                select: {
                    models: {},
                    styles: {}
                },
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
    async beforeMount() {
        this.date = this.setDefaultDate(1)
        this.setDate(this.date);
    },
}
