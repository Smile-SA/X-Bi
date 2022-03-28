import * as instance from "../../controller/instancesController";

import * as utils from '../../settings/utils'

export default {
    name: 'monitoring',
    components: {
    },
    props: [],
    data() {
        return {
            group: 'Hour',
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            activeGroup: null,
            list: null,
            date: null,
            queryBegin:"",
            chartStyle:{},
            active: null,
            chartModels:{},
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {},
    beforeMount() {
        this.getInstances();
    },
    methods: {
        async getInstances() {
            await instance.getInstances().then((data) => {
                if (data.total > 0) {
                    this.list = data.results;
                }
            });
        },
        setDate(date) {
            this.activeGroup = date
            this.date = date;
            utils.refreshDate(date, this);
        },
        async setGroup(event){
            this.group = event.target.value;
            this.setDate(this.date)
        },
        setInstance(instance) {
            this.active = instance.target.value;
            this.queryBegin = '/metrics/' + this.active;
            if (this.date !== null) {
                this.setDate(this.date)
            }
        },
        showDatePicker() {
            return this.active !== null
        },
        showGroup() {
            return this.activeGroup !== null
        },
    }
}


