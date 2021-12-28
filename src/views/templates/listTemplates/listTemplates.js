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
        }
    },
    computed: {
    },
    mounted() {
    },
    async beforeMount(){
        this.Templates();
    },
    methods: {
        Templates() {
            getTemplates().then((data) => {
                this.templatesNb = data.total;
                this.templatesList = data.results;
            });
        },
        go(route) {
            goTo(route,this)
        }
    }
}


