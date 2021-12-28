import {generateAPIUrl} from '../../settings/variables'
import * as utils from '../../settings/utils'
import * as genaralController from "../../controller/genaralController";

const api = generateAPIUrl()
export default {
    components: {
        Card: () => import('../../components/Layout/card/index.vue'),
        ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts/index.vue'),
    },
    data() {
        return {
            date: this.setDefaultDate(),
            lineChartNodes: null,
            donut: {},
            donuts: {},
            nameSpace: {},
            node: {},
            lineChartNamespaces: null,
            dateRange: null,
            to: null,
            from: null,
            groupOptions: ['Hour','Day','Month','Year'],
            group: 'Day',
            confChartNodes: {
                id: 'lineChartNodes',
                type: 'line',
                height: 400,
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
                height: 400,
                fontSize: '20px',
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
                colorLabel: 'primary',
                svg: 'slice-icon',
                type: 'number',
                color: '#008ffb',
                value: 0,
            },
            confCardPods: {
                from: this.from,
                to: this.to,
                link: '/pods',
                label: 'Pods',
                colorLabel: 'success',
                icon: 'fa fa-sitemap',
                type: 'number',
                color: '#00e396',
                value: 0
            },
            confCardNodes: {
                from: this.from,
                to: this.to,
                link: '/nodes',
                label: 'Nodes',
                colorLabel: 'warning',
                icon: 'fa fa-server',
                type: 'number',
                color: '#feb019',
                value: 0
            },
        }
    },
    computed: {},
    methods: {
        getNodesToApex() {
            this.node.height = undefined;
            genaralController.getJsonDataToApex(`${api}/nodes/rating`, this.confChartNodes, this).then(async (r) => {
                if (r.total > 0) {
                    this.node = r;
                }
            });
        },
        getNamespacesToApex() {
            this.nameSpace.height = undefined;
            genaralController.getJsonDataToApex(`${api}/namespaces/rating`, this.confChartNameSpace, this).then(async (r) => {
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
                        }
                    },
                    legend: {
                        show: false
                    }
                };
                this.donut.height = 120;
                this.donuts = this.donut;
            }
        },
        setQueryData() {
            return utils.convertURLDateParameter(this.from, this.to)
        },
        setDefaultDate() {
            var e = new Date, n = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate() - 6)),
                a = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()));
            return {start: n, end: a}
        },
        refreshDate(date) {
            this.dateRange = date;
            utils.refreshDate(date, this);
        },
        refreshOptions(event) {
            this.group = event.target.value;
            this.refreshDate(this.date);
        },
        async drawCards() {
            await genaralController.getJsonData('/namespaces' + this.setQueryData()).then(async (r) => {
                if (r.total > 0) {
                    this.confCardNamespaces.value = r.total;
                    this.$forceUpdate()
                }
            });
            await genaralController.getJsonData('/nodes' + this.setQueryData()).then(async (r) => {
                if (r.total > 0) {
                    this.confCardNodes.value = r.total;
                    this.$forceUpdate()
                }
            });
            await genaralController.getJsonData('/pods' + this.setQueryData()).then(async (r) => {
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
                    genaralController.getJsonDataToApex(`${api}/nodes/rating`, this.confChartNodes, this,).then(async (r) => {
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
