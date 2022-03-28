import PieChart from '../src/components/graphics/charts.js/PieChart';
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';

import {generateData} from "./data";

export default {
    title: 'Chart',
    component: PieChart,
    decorators: [withKnobs],
};

const defaultConfig = {
    id: 'pieChart',
    sort: 'anonymous',
    colors: [],
    isMobile: () => false,
    labels: {
        time: 'frame_begin',
        value: 'frame_price',
        title: 'Some title'
    }
};

export const Pie = () => ({
    components: { PieChart },
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
    template: '<pie-chart class="pointer" :configuration=configuration :idL="\'pieChart\'"  :height=100 :dataS=this.getAsyncData() />',
});
