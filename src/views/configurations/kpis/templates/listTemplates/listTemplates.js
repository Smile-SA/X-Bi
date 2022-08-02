import * as template from "../../../../../controller/templatesController";
import actions from "../../../../../components/tableAction/urlAction";
import * as utils from "../../../../../settings/utils";

export default {
    name: 'list-templates',
    components: {},
    props: [],
    data() {
        return {
            hover: true,
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
                        component: actions
                    }
                ]
            }
        }
    },
    methods: {
        async getDefaultValue(d) {
            await template.defaultValue(d.id).then(async (r) => {
                d.isDelete = r
            })
        },
        Templates: async function () {
            await template.getTemplates().then((r) => {
                //console.log(r)
                this.templatesNb = r.total;
                let data = [];
                Object.keys(r.results).map((item) => {
                    let d = {
                        'name': r.results[item].template_name,
                        'url': '/templates',
                        'deleteTagIndex': 3,
                        'colspan': 2,
                        'deleteParam': 'query_name',
                        'id': (r.results[item].template_name).replace('rating-rule-template-', ''),
                        'isDisplayed': true,
                        'isUpdated': false,
                        'isDeleted': !r.results[item].is_default,
                    }
                    this.getDefaultValue(d);
                    data.push(d)
                });
                this.templatesList = data;
            });
        },

    },
    async beforeMount() {
        utils.titleBoxRender(this)
        this.Templates();
    },

}


