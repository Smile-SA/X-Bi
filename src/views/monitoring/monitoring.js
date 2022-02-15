import * as instance from "../../controller/instancesController";
import * as general from "../../controller/genaralController";
import * as utils from "../../settings/utils";

export default {
    name: 'monitoring',
    components: {
        ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts'),
        GroupBy: () => import ('../../components/Layout/group/index'),
        DatePicker: () => import ('../../components/Layout/datePicker/index'),
        SelectOption: () => import ('../../components/Layout/selectOption/index'),
    },
    props: [],
    data() {
        return {
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
            group: 'Hour',
            activeGroup: null,
            instancesList: null,
            date: null,
            instances: {},
            activeInstance: null,
            confChartInstances: {
                id: 'lineChart',
                type: 'area',
                height: 470,
                fontSize: '16px',
                sort: 'instance',
                xaxis: {
                    type: 'datetime'
                },
                labels: {
                    time: 'frame_begin',
                    value: 'price',
                    title: 'Nodes rate (in Euros)'
                }
            },
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
    computed: {},
    beforeMount() {
        this.getInstances();
    },
    async mounted() {
        await this.refreshChart();
    },
    methods: {
        async getInstances() {
            await instance.getInstances().then((data) => {
                if (data.total > 0) {
                    this.instancesList = data.results;
                }
            });
        },
        setDate(date) {
            this.activeGroup = date
            this.date = date;
            utils.refreshDate(date, this);
        },
        setGroup(group) {
            this.group = group.target.value;
            this.setDate(this.date);
        },
        setInstance(instance) {
            this.activeInstance = instance.target.value;
            if (this.date !== null) {
                this.setDate(this.date)
            }
        },
        showDatePicker() {
            return this.activeInstance !== null
        },
        showGroup() {
            return this.activeGroup !== null
        },
        updateCharts() {
            this.instances.height = undefined;
            general.getDataByDateToApex('/metrics/' + this.activeInstance + '/rating', this.from, this.to, this.activeInstance, this.group, this.confChartInstances).then(async (r) => {
                if (r.total!==undefined && r.total > 0) {
                    this.instances = r;
                    console.log(r)
                }
            });
        },
        async refreshChart() {
            await setInterval(() => {
                if (this.instances.height!==undefined) {
                    general.getNewDataByDateToApex('/metrics/' + this.activeInstance + '/rating', this.from, this.to, this.activeInstance, this.group, this.confChartInstances,this.instances.lastDate).then(async (r) => {
                        if (r.total!==undefined && r.total > 0) {
                            if(r.lastDate>this.instances.lastDate){
                                this.instances.series = r.series;
                                this.instances.lastDate = r.lastDate;
                            }
                        }
                    });
                }
            }, 1000);
        },
        drawCharts() {
            this.updateCharts()
        },
    }
}


