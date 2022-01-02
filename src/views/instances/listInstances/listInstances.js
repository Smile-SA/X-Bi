import {getInstances} from "../../../controller/instancesController";
import {goTo} from "../../../settings/utils";

export default {
    name: 'list-instances',
    components: {
        TableAction: () => import('../../../components/Layout/tableAction/index')
    },
    props: [],
    data() {
        return {
            instancesList: [],
            instanceNb: 0,
        }
    },
    computed: {},
    mounted() {
    },
    async beforeMount(){
        this.Instances();
    },
    methods: {
        Instances() {
            getInstances().then((data) => {
                this.instanceNb = data.total;
                this.instancesList = data.results;
            });
        },
        go(route) {
            goTo(route,this)
        },
    }
}


