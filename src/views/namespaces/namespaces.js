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
            namespaces: null,
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
    computed: {
        confChartNodesPods() {
            return {
                id: 'pieChartNodesPods',
                type: 'donut',
                height: 450,
                fontSize: '20px',
                sort: 'node',
                xaxis: {
                    type: 'datetime'
                },
                labels: {
                    time: 'frame_begin',
                    value: 'frame_price',
                    title: 'Services repartition by nodes'
                }
            }
        },
    },
    methods: {
        showDatePicker() {
            return this.active !== null
        },
        showGroup() {
            return this.active !== null && this.date
        },
        async setNamespaces(namespace) {
            this.active = namespace.target.value;
            this.queryBegin = '/namespaces/' + this.active;
            this.setDate(this.date)
        },
        async setDate(date) {
            if (date) {
                await this.setModelsData();
                this.date = date;
                await utils.refreshDate(this.date, this);
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
        this.namespaces = (await utils.fetchData(`/namespaces`)).map(item => item.namespace);
    },
    async mounted() {
    }
}