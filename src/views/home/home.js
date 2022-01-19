import * as utils from '../../settings/utils'
import * as general from "../../controller/genaralController";

export default {
    components: {
        Card: () => import('../../components/Layout/card'),
        ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts'),
        GroupBy: () => import ('../../components/Layout/group/index'),
        DatePicker: () => import ('../../components/Layout/datePicker/index'),
    },
    data() {
        return {
            date: null,
            lineChartNodes: null,
            nameSpace: {},
            node: {},
            lineChartNamespaces: null,
            to: null,
            from: null,
            group: 'Hour',
            confChartNodes: {
                id: 'lineChartNodes',
                type: 'line',
                height: 470,
                fontSize: '16px',
                sort: 'node',
                xaxis: {
                    type: 'datetime'
                },
                labels: {
                    time: 'frame_begin',
                    value: 'frame_price',
                    title: 'Nodes rate (in Euros)'
                }
            },
            confChartNameSpace: {
                id: 'lineChartNamespaces',
                type: 'area',
                height: 470,
                fontSize: '16px',
                sort: 'namespace',
                xaxis: {
                    type: 'datetime'
                },
                labels: {
                    time: 'frame_begin',
                    value: 'frame_price',
                    title: 'Namespaces Energy Efficiency'
                },
            },
            confCardNamespaces: {
                from: this.from,
                to: this.to,
                link: '/namespaces',
                label: 'Namespaces',
                colorLabel: 'success',
                icon: 'mdi mdi-share-variant',
                type: 'number',
                color: '#0cceb0',
                value: 0,
            },
            confCardPods: {
                from: this.from,
                to: this.to,
                link: '/pods',
                label: 'Pods',
                colorLabel: 'primary',
                icon: 'mdi mdi-sitemap',
                type: 'number',
                color: '#1eaae1',
                value: 0
            },
            confCardNodes: {
                from: this.from,
                to: this.to,
                link: '/nodes',
                label: 'Nodes',
                colorLabel: 'warning',
                icon: 'mdi mdi-server',
                type: 'number',
                color: '#fed60a',
                value: 0
            },
        }
    },
    computed: {},
    methods: {
        showGroup() {
            return this.date !== null
        },
        getNodesToApex() {
            this.node.height = undefined;
            general.getDataByVariableAndDateToApex('nodes/rating', this.confChartNodes, this).then(async (r) => {
                if (r.total > 0) {
                    this.node = r;
                }
            });
        },
        getNamespacesToApex() {
            this.nameSpace.height = undefined;
            general.getDataByVariableAndDateToApex('/namespaces/rating', this.confChartNameSpace, this).then(async (r) => {
                if (r.total > 0) {
                    this.nameSpace = r;
                }
            });
        },
        setQueryData() {
            return utils.convertURLDateParameter(this.from, this.to)
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
        setDate(date){
                this.date = date
                utils.refreshDate(this.date, this);
        },
        async drawCards() {
            await general.getJsonData('/namespaces' + this.setQueryData()).then(async (r) => {
                if (r.total > 0) {
                    this.confCardNamespaces.value = r.total;
                    this.$forceUpdate()
                }
            });
            await general.getJsonData('/nodes' + this.setQueryData()).then(async (r) => {
                if (r.total > 0) {
                    this.confCardNodes.value = r.total;
                    this.$forceUpdate()
                }
            });
            await general.getJsonData('/pods' + this.setQueryData()).then(async (r) => {
                if (r.total > 0) {
                    this.confCardPods.value = r.total;
                    this.$forceUpdate();
                }
            });
        },
        async drawGraphs() {
            await this.getNodesToApex();
            await this.getNamespacesToApex();
        },
        async callUpdateFunction() {
            await setInterval(() => {
                if (this.node.header > 0) {
                    general.getJsonDataToApex('/nodes/rating', this.confChartNodes, this,).then(async (r) => {
                        if (r.total > 0) {
                            this.node.series = r.series;
                        }
                    });
                }
            }, 10000);
        },
    },
    async update() {

    },
    async beforeMount() {
        this.date = this.setDefaultDate(1)
        this.setDate(this.date);
    },
    async mounted() {
         //await this.callUpdateFunction();
    }
}
