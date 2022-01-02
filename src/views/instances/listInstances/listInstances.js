import {getInstances} from "../../../controller/instancesController";
import {goTo} from "../../../settings/utils";

export default {
    name: 'list-instances',
    components: {
    },
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
                showDownloadButton:false,
                columns: [
                    {
                        key: "name",
                        title: "Instance name"
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
    async beforeMount(){
        this.Instances();
    },
    methods: {
        Instances() {
            getInstances().then((data) => {
                this.instanceNb = data.total;
                Object.keys(data.results).map((item) => {
                    this.instancesList.push({
                        'name': data.results[item],
                        'url':'/instances',
                        'deleteTagIndex':4,
                        'colspan':2,
                        'deleteParam':'query_name',
                        'id': data.results[item].replace('rating-rule-instance-',''),
                        'isDisplay':true ,
                        'isUpdate':false ,
                        'isDelete':true
                    })
                });
            });
        },
        go(route) {
            goTo(route,this)
        },
    }
}


