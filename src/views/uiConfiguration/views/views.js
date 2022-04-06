import displayView from "../../../components/tableAction/edit/editViewsDisplay";
import requiresAuth from "../../../components/tableAction/edit/editRequires";
import editName from "../../../components/tableAction/edit/editName";
import editDescription from "../../../components/tableAction/edit/editDescription";
import editIcon from "../../../components/tableAction/edit/editIcon";
import * as controller from "../../../controller/routerController.js"

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
                        key: "requiresAuth",
                        title: "Requires authentication",
                        component: requiresAuth
                    },
                    {
                        key: "display",
                        title: "Display",
                        component: displayView
                    }
                ]
            }
        }
    },
    methods: {
        Templates() {
            let children = controller.getChildren()
            Object.keys(children).map((item) => {
                this.dynamicViews.push(children[item])
            });
        },

    },
    async beforeMount() {
        this.Templates();
    },
    mounted() {

    },

}


