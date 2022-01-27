import * as template from "../../../../controller/templatesController";
import tableAction from "../../../../components/Layout/tableAction";

export default {
    name: 'list-templates',
    components: {},
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
                showDownloadButton: false,
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
        async getDefaultValue(d){
             await template.defaultValue(d.id).then(async (r) => {
                 d.isDelete = r
            })
        },
        Templates: async function () {
            await template.getTemplates().then((r) => {
                this.templatesNb = r.total;
                let data = [];
                 Object.keys(r.results).map((item) => {
                     let d = {
                         'name': r.results[item],
                         'url': '/templates',
                         'deleteTagIndex': 4,
                         'colspan': 2,
                         'deleteParam': 'query_name',
                         'id': r.results[item].replace('rating-rule-template-', ''),
                         'isDisplay': true,
                         'isUpdate': false,
                     }
                     this.getDefaultValue(d);
                     data.push(d)
                });
                this.templatesList= data;
            });
        },

    }
}


