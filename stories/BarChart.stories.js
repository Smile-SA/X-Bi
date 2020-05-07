import BarChart from '../src/components/charts/BarChart';
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';

import {generateData} from "./data";

export default {
    title: 'Chart',
    component: BarChart,
    decorators: [withKnobs],
};

const defaultConfig = {
    id: 'barChart',
    sort: 'anonymous',
    colors: [],
    isMobile: () => false,
    labels: {
        time: 'frame_begin',
        value: 'frame_price',
        title: 'Some title'
    }
};

export const Bar = () => ({
    components: { BarChart },
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
    template: '<bar-chart class="pointer" :configuration=configuration :idL="\'barChart\'"  :height=100 :dataS=this.getAsyncData() />',
});
