import * as instance from "@/controller/instancesController";
import tableAction from "../../../components/Layout/tableAction";

export default {
    name: 'list-instances',
    components: {},
    props: [],
    data() {
        return {
            instancesList: [],
            instanceNb: 0,
        }
    },
    computed: {
        bindings() {
            return {
                data: this.instancesList,
                showDownloadButton: false,
                columns: [
                    {
                        key: "name",
                        title: "Instance name"
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
        this.Instances();
    },
    methods: {
        Instances() {
            instance.getInstances().then((data) => {
                this.instanceNb = data.total;
                Object.keys(data.results).map((item) => {
                    this.instancesList.push({
                        'name': data.results[item],
                        'url': '/instances',
                        'deleteTagIndex': 4,
                        'colspan': 2,
                        'deleteParam': 'metric_name',
                        'id': data.results[item].replace('rating-rule-instance-', ''),
                        'isDisplayed': true,
                        'isUpdateed': false,
                        'isDeleted': true

                    })
                });
            });
        },
    }
}


