import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';

import apexChartsComponent from "../../src/components/apexCharts";

export default {
    title: 'ApexCharts',
    component: apexChartsComponent,
    decorators: [withKnobs],
};

const defaultOptions = {
    chart: {
        id: 'vuechart-example',type:"line"
    },
    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
};
const defaultSeries = {
    name: 'Vue Chart',
    data: [30, 40, 45, 50, 49, 60, 70, 81]
};
export const Line = () => ({
    components: {apexChartsComponent},
    props: {
        chartOptions: {
            default: object('chartOptions', defaultOptions),
        },
        chartSeries: {
            default: object('chartSeries', [defaultSeries]),
        },
    },
    methods: {
        updateChart() {
            const max = 90;
            const min = 20;
            const newData = this.chartSeries[0].data.map(() => {
                return Math.floor(Math.random() * (max - min + 1)) + min
            })
            // In the same way, update the series option
            this.chartSeries = [{
                name: 'Vue Chart',
                data: newData
            },{
                name: 'Vue hi',
                data: newData
            }];
            return this.chartSeries;
        }
    },
    template: '<apex-charts-component  :chartSeries="updateChart()" :chartOptions="chartOptions"/>',
});