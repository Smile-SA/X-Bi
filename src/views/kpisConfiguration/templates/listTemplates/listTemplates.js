import * as template from "../../../../controller/templatesController";
import tableAction from "../../../../components/Layout/tableAction";

export default {
    name: 'list-templates',
    components: {
    },
    props: [],
    data() {
        return {
            templatesList: [],
            templatesNb: 0,
        }
    },
    computed: {
        bindings() {
            return {
                data: this.templatesList,
                showDownloadButton:false,
                columns: [
                    {
                        key: "name",
                        title: "Template name"
                    },
                    {
                        key: "Actions",
                        component: tableAction
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
            template.getTemplates().then((data) => {
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

    }
}


