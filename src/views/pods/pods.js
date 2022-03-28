import * as utils from '../../settings/utils'

export default {
    components: {},
    data() {
        return {
            confCardStart: {
                label: 'Started at',
                link: '/',
                icon: 'mdi mdi-calendar-today',
                type: 'date',
                colorLabel: 'dark',
                color: '#6c757d',
                value: '',
            },
            confCardEnd: {
                colorLabel: 'dark',
                color: '#6c757d',
                link: '/',
                label: 'Ended at',
                icon: 'mdi mdi-calendar',
                type: 'date',
                value: '',
            },
            group: 'Hour',
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            queryBegin: "",
            to: null,
            from: null,
            date: null,
            active: null,
            pods: null,
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
        async setPod(pod) {
            this.active = pod.target.value;
            this.queryBegin = '/pods/' + this.active;
            this.setDate(this.date)
        },
        async setDate(date) {
            if (date !== null) {
                await this.setModelsData();
                this.date = date;
                utils.refreshDate(date, this);
            }
        },
        async setGroup(event) {
            this.group = event.target.value;
            await this.setDate(this.date)
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
        this.pods = (await utils.fetchData('/pods')).map(item => item.pod);
    },
    async mounted() {
    }
}