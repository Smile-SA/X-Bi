import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';

import apexChartsComponent from "../../src/components/graphics/apexcharts";

export default {
    title: 'ApexCharts',
    component: apexChartsComponent,
    decorators: [withKnobs],
};

const defaultOptions = {
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
};
const defaultSeries = [{
    name: 'Net Profit',
    data: [ 61, 58, 63, 60, 66]
}, {
    name: 'Net Profit',
    data: [44, 55, 57, 56]
},{
    name: 'Revenue',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
}, {
    name: 'Free Cash Flow',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
}]
export const Bar = () => ({
    components: {apexChartsComponent},
    props: {
        chartOptions: {
            default: object('chartOptions', defaultOptions),
        },
        chartSeries: {
            default: object('chartSeries', defaultSeries),
        },
    },
    // methods: {
    //     updateChart() {
    //         const max = 90;
    //         const min = 20;
    //         const newData = this.chartSeries[0].data.map(() => {
    //             return Math.floor(Math.random() * (max - min + 1)) + min
    //         })
    //         // In the same way, update the series option
    //         this.chartSeries = [{
    //             name: 'Vue Chart',
    //             data: newData
    //         }];
    //         return this.chartSeries;
    //     }
    // },
     template: '<apex-charts-component :chartOptions="chartOptions" :chartSeries="chartSeries" />',
});
