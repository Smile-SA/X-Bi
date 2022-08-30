import VueApexCharts from 'vue-apexcharts'
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';
import StoryRouter from "storybook-vue-router";

export default {
    title: 'Apex chart',
    components: {VueApexCharts},
    decorators: [withKnobs, StoryRouter(
        {},
    )]
};
let apexData = {
    id: 'id',
    options: {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        }
    },
    series: [
        {
            name: 'Net Profit',
            data: [61, 58, 63, 60, 66]
        }, {
            name: 'Net Profit',
            data: [44, 55, 57, 56]
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }]
};
export const AreaChart = () => ({
    beforeMount() {
        this.apex.options.chart.type = 'area'
    },
    components: {VueApexCharts},
    props: {
        apex: {
            type: Object,
            default: object('apex', apexData),
        },
    },
    template: '<vue-apex-charts class="p-2" :ref="apex.id" :options="apex.options" :series="apex.series" :height="apex.options.chart.height" ></vue-apex-charts>',
});
export const BarChart = () => ({
    beforeMount() {
        this.apex.options.chart.type = 'bar'
    },
    components: {VueApexCharts},
    props: {
        apex: {
            type: Object,
            default: object('apex', apexData),
        },
    },
    template: '<vue-apex-charts class="p-2" :ref="apex.id" :options="apex.options" :series="apex.series" :height="apex.options.chart.height" ></vue-apex-charts>',
});
export const HeatMapChart = () => ({
    beforeMount() {
        this.apex.options.chart.type = 'heatmap';
    },
    components: {VueApexCharts},
    props: {
        apex: {
            type: Object,
            default: object('apex', apexData),
        },
    },
    template: '<vue-apex-charts class="p-2" :ref="apex.id" :options="apex.options" :series="apex.series" :height="apex.options.chart.height" ></vue-apex-charts>',
});
export const ScatterChart = () => ({
    beforeMount() {
        this.apex.options.chart.type = 'scatter';
    },
    components: {VueApexCharts},
    props: {
        apex: {
            type: Object,
            default: object('apex', apexData),
        },
    },
    template: '<vue-apex-charts class="p-2" :ref="apex.id" :options="apex.options" :series="apex.series" :height="apex.options.chart.height" ></vue-apex-charts>',
});

