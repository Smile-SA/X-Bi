import Card from '../src/components/graphics/card/index.vue';
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';
import StoryRouter from "storybook-vue-router";

export default {
    title: 'Card',
    component: Card,
    decorators: [withKnobs, StoryRouter(
        {},
    )]
};

let cardData = [
    {
    "models": [
        {
            "space": "1/4",
            "type": "default",
            "title": "Cities",
            "icon": "fa-city",
            "color": "red",
            "redirect": "/city",
            "query": "http://localhost:5012/cities",
            "method": "count",
            "value": ""
        },
        {
            "space": "1/4",
            "type": "default",
            "title": "Areas",
            "icon": "fa-map",
            "color": "blue",
            "query": "http://localhost:5012/cities",
            "query_key": "area",
            "method": "sum",
            "value": "",
            "unit": "km²"
        },
        {
            "space": "1/4",
            "type": "default",
            "title": "Inhabitants",
            "icon": "fa-people-roof",
            "color": "yellow",
            "query": "http://localhost:5012/cities",
            "query_key": "inhabitants",
            "method": "sum",
            "value": ""
        },
        {
            "space": "1/4",
            "type": "default",
            "title": "Devices",
            "icon": "fa-person-digging",
            "color": "green",
            "query": "http://localhost:5012/cities",
            "query_key": "device",
            "method": "sum",
            "value": ""
        }
    ],
    "styles": {
        "height": "60"
    }
},
    {
    "models": [
        {
            "space": "1/4",
            "type": "default",
            "title": "Cities",
            "icon": "fa-city",
            "color": "dark",
            "redirect": "/city",
            "query": "http://localhost:5012/cities",
            "method": "count",
            "value": ""
        },
        {
            "space": "1/4",
            "type": "default",
            "title": "Areas",
            "icon": "fa-map",
            "color": "cyan",
            "query": "http://localhost:5012/cities",
            "query_key": "area",
            "method": "sum",
            "value": "",
            "unit": "km²"
        },
        {
            "space": "2/4",
            "type": "default",
            "title": "Inhabitants",
            "icon": "fa-people-roof",
            "color": "orange",
            "query": "http://localhost:5012/cities",
            "query_key": "inhabitants",
            "method": "sum",
            "value": ""
        }
    ],
    "styles": {
        "height": "60"
    }
}
];
export const Example1 = () => ({
    components: {Card},
    props: {
        card: {
            type: Object,
            default: object('card', cardData[0]),
        },
    },
    template:
        '<div class="col-12 p-3" v-if="card.models!=undefined && Object.keys(card.models).length>0">\n' +
        '    <div class="row">\n' +
        '        <div v-for="item in card.models" :class="item.space === \'1/4\' ? \'col-sm-3 m-b\' : item.space === \'2/4\' ? \'col-sm-6 m-b\' : item.space === \'3/4\' ? \'col-sm-9 m-b\' : item.space === \'4/4\' ? \'col-sm-12 m-b\' : \'col-sm-4 m-b\'">\n' +
        '            <Card :configuration="item" :styles="card.styles"></Card>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>',
});
export const Example2 = () => ({
    components: {Card},
    props: {
        card: {
            type: Object,
            default: object('card', cardData[1]),
        },
    },
    template:
        '<div class="col-12 p-3" v-if="card.models!=undefined && Object.keys(card.models).length>0">\n' +
        '    <div class="row">\n' +
        '        <div v-for="item in card.models" :class="item.space === \'1/4\' ? \'col-sm-3 m-b\' : item.space === \'2/4\' ? \'col-sm-6 m-b\' : item.space === \'3/4\' ? \'col-sm-9 m-b\' : item.space === \'4/4\' ? \'col-sm-12 m-b\' : \'col-sm-4 m-b\'">\n' +
        '            <Card :configuration="item" :styles="card.styles"></Card>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>',
});


