import * as utils from '../../settings/utils'

export default {
    components: {},
    data() {
        return {
            group: 'Hour',
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            queryBegin: "",
            to: null,
            from: null,
            date: null,
            active: null,
            nodes: null,
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
    computed: {},
    methods: {
        showGroup() {
            return this.active !== null && this.date !== null
        },
        showDatePicker() {
            return this.active !== null
        },
        async setNode(node) {
            this.active = node.target.value
            this.queryBegin = '/nodes/' + this.active;
            this.setDate(this.date)
        },
        async setDate(date) {
            if (date !== null) {
                await this.setModelsData()
                this.date = date;
                utils.refreshDate(date, this);
            }
        },
        async setGroup(event) {
            this.group = event.target.value;
            this.setDate(this.date)
        },
        setModelsData() {
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
        }
    },
    async beforeMount() {
        this.nodes = (await utils.fetchData('/nodes')).map(item => item.node)
    },
    async mounted() {
    }
}