import {getTemplates} from "../../../controller/templatesController";
import {goTo} from "../../../settings/utils";

export default {
    name: 'list-templates',
    components: {
        TableAction: () => import('../../../components/Layout/tableAction/index')
    },
    props: [],
    data() {
        return {
            templatesList: [],
            templatesNb: 0,
            text: '',
        }
    },
    computed: {
        bindings() {
            return {
                data: this.templatesList,
                columns: [
                    {
                        key: "name",
                        title: "Template name"
                    },
                    {
                        key: "Actions",
                        component: () => import('../../../components/Layout/tableAction/index')
                    }
                ]
            }
        }
    },
    mounted() {

    },
    async beforeMount() {
        this.Templates();
    },
    methods: {

        Templates() {
            getTemplates().then((data) => {
                this.templatesNb = data.total;
                Object.keys(data.results).map((item) => {
                    this.templatesList.push({
                        'name': data.results[item],
                        'url':'/templates',
                        'deleteTagIndex':4,
                        'colspan':2,
                        'deleteParam':'query_name',
                        'id': data.results[item].replace('rating-rule-template-',''),
                        'isDisplay':true ,
                        'isUpdate':false ,
                        'isDelete':true
                    })
                });
            });
        },
        go(route) {
            goTo(route, this)
        },
    }
}


