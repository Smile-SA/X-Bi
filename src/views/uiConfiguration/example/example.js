import checkbox from "@/components/Layout/checkbox";
import * as controller from "@/controller/routerController.js"


export default {
    name: 'example',
    components: {},
    props: [],
    data() {
        return {
            example: [],
            templatesNb: 0,
        }
    },
    computed: {
        bindings() {
            return {
                data: this.example,
                showDownloadButton: false,
                columns: [
                    {
                        key: "name",
                        title: "Name"
                    },
                    {
                        key: "description",
                        title: "Description"
                    },
                    {
                        key: "path",
                        title: "Path"
                    },
                    {
                        key: "requiresAuth",
                        title: "Requires authentication",
                    },
                    {
                        key: "display",
                        title: "Display",
                        component: checkbox
                    },
                ]
            }
        }
    },
    methods: {
        Templates() {
            this.example.push(controller.getDefaultRoutes())
            let children = controller.getChildren()
            Object.keys(children).map((item) => {
                this.example.push(children[item])
            });
        },

    },
    async beforeMount() {
        this.Templates();
    },
    mounted() {

    },

}


