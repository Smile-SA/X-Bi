import displayView from "../../../components/tableAction/edit/editViewsDisplay";
import editName from "../../../components/tableAction/edit/editName";
import editDescription from "../../../components/tableAction/edit/editDescription";
import editIcon from "../../../components/tableAction/displayIcon";
import * as controller from "../../../controller/routerController.js"
import actions from "../../../components/tableAction/sessionAction";

export default {
    name: 'views',
    components: {},
    props: [],
    data() {
        return {
            dynamicViews: [],
            templatesNb: 0,
        }
    },
    computed: {
        bindings() {
            return {
                data: this.dynamicViews,
                showDownloadButton: false,
                columns: [
                    {
                        key: "name",
                        title: "Name",
                        component: editName
                    },
                    {
                        key: "description",
                        title: "Description",
                        component: editDescription

                    },
                    {
                        key: "icon",
                        title: "icon",
                        component: editIcon,
                    },
                    {
                        key: "display",
                        title: "Display",
                        component: displayView
                    },
                    {
                        title: "Structures",
                        component: actions
                    }
                ]
            }
        }
    },
    methods: {
        Templates() {
            let views = controller.getChildren()
            Object.keys(views).map((item) => {
                let d = {
                    'id': views[item].name,
                    'name': views[item].name,
                    'component': views[item].component,
                    'description': views[item].description,
                    'display': views[item].display,
                    'icon': views[item].icon,
                    'structureType':'view',
                    'url': '/structure',
                    'deleteTagIndex': '4',
                    'colspan': '',
                    'deleteParam': '',
                    'isDisplayed': true,
                    'isPreviewed': false,
                    'isUpdated': true,
                    'isDeleted': true,
                }
                this.dynamicViews.push(d)
            });
        },

    },
    async beforeMount() {
        this.Templates();
    },
    mounted() {

    },

}


