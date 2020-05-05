import LineChart from '../src/components/charts/LineChart';
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';
import * as utils from "../src/utils";

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

function generateData()
{
    let nbr = Math.floor(Math.random() * 10);
    const data =  {
        total: nbr,
        results: []
    }

    for(let i = 0; i < nbr;i++) {
        data.results.push(
            {frame_begin: `Sun, 05 Apr 2020 0${i}:00:00 GMT`, frame_price: Math.random() * 10, node: "cute-robin"}
        );
    }
    return data;
}
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
