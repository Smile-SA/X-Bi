import {generateAPIUrl} from '../../settings/variables'
import * as utils from '../../settings/utils'
import * as general from "../../controller/genaralController";

const api = generateAPIUrl()
export default {
    components: {
        Card: () => import('../../components/Layout/card'),
        ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts'),
    },
    data() {
        return {
            date: this.setDefaultDate(1),
            lineChartNodes: null,
            donut: {},
            donuts: {},
            nameSpace: {},
            node: {},
            lineChartNamespaces: null,
            dateRange: {
                start: new Date(2018, 5, 1),
                end: new Date(2018, 5, 31)
            },
            to: null,
            from: null,
            groupOptions: ['Hour', 'Day', 'Month', 'Year'],
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
        getNodesToApex() {
            this.node.height = undefined;
            general.getJsonDataToApex(`${api}/nodes/rating`, this.confChartNodes, this).then(async (r) => {
                if (r.total > 0) {
                    this.node = r;
                }
            });
        },
        getNamespacesToApex() {
            this.nameSpace.height = undefined;
            general.getJsonDataToApex(`${api}/namespaces/rating`, this.confChartNameSpace, this).then(async (r) => {
                if (r.total > 0) {
                    this.nameSpace = r;
                }
            });
        },
        getPieDataToApex() {
            this.donut.height = 0;
            if (this.confCardNamespaces.value !== 0 || this.confCardNodes.value !== 0 || this.confCardPods.value !== 0) {
                this.donut.series = [this.confCardNamespaces.value, this.confCardNodes.value, this.confCardPods.value];
                this.donut.options = {
                    chart: {
                        type: 'donut',
                    },
                    colors: [this.confCardNamespaces.color, this.confCardNodes.color, this.confCardPods.color],
                    labels: [this.confCardNamespaces.label, this.confCardNodes.label, this.confCardPods.label],
                    dataLabels: {
                        style: {
                            fontFamily: "open sans,Helvetica Neue, Helvetica, Arial, sans-serif",
                            fontWeight: 0,
                            color: '#ffffff',
                        },
                    },
                    legend: {
                        show: false
                    }
                };
                this.donut.height = 130;
                this.donuts = this.donut;
            }
        },
        setQueryData() {
            return utils.convertURLDateParameter(this.from, this.to)
        },
        setDefaultDate(jour, month, year) {
            var e = new Date,n, a = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()));
            if(jour>0){
                n = new Date(Date.UTC(e.getFullYear() , e.getMonth() , e.getDate() - jour))
            }
            if(month>0){
                n = new Date(Date.UTC(e.getFullYear() , e.getMonth() - month, e.getDate() ))
            }
            if(year>0){
                n = new Date(Date.UTC(e.getFullYear() -year , e.getMonth() , e.getDate() ))
            }
            return {start: n, end: a}
        },
        refreshDate(date) {
            utils.refreshDate(date, this);
        },
        refreshOptions(event) {
            this.group = event.target.value;
            // if (this.group === 'Hour') {
            //     this.date = this.date = this.setDefaultDate(1, 0, 0)
            // }
            // else if (this.group === 'Day') {
            //     this.date = this.date = this.setDefaultDate(6, 0, 0)
            // } else if (this.group === 'Month') {
            //     this.date = this.date = this.setDefaultDate(0, 6, 0)
            // } else if (this.group === 'Year') {
            //     this.date = this.date = this.setDefaultDate(0, 0, 1)
            // }
            this.refreshDate(this.date);
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
            await this.getPieDataToApex();
            await this.getNodesToApex();
            await this.getNamespacesToApex();
        },
        async callUpdateFunction() {
            await setInterval(() => {
                if (this.node.header > 0) {
                    console.log('-- updateloop --');
                    general.getJsonDataToApex(`${api}/nodes/rating`, this.confChartNodes, this,).then(async (r) => {
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


        this.refreshDate(this.date);
    },
    async mounted() {
        // await this.callUpdateFunction();
    }
}
