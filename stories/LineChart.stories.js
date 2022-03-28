import LineChart from '../src/components/graphics/charts.js/LineChart';
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';

import {generateData} from "./data";

export default {
    title: 'Chart',
    component: LineChart,
    decorators: [withKnobs],
};

const defaultConfig = {
    id: 'lineChart',
    sort: 'anonymous',
    colors: [],
    isMobile: () => false,
    labels: {
        time: 'frame_begin',
        value: 'frame_price',
        title: 'Some title'
    }
};

export const Line = () => ({
    components: { LineChart },
    props: {
        configuration: {
            type: Object,
            default: object('configuration', defaultConfig),
        },
    },
    methods: {
        async getAsyncData() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(generateData());
                }, 300);
            });
        },
    },
    template: '<line-chart class="pointer" :configuration=configuration :idL="\'lineChart\'"  :height=100 :dataS=this.getAsyncData() />',
});
