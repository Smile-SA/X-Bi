
import editForm from "../../../components/forms/session/edit";
import deleteForm from "../../../components/forms/session/delete";
import previewForm from "../../../components/forms/session/preview";
export default {
    name: 'session-action',
    components: {editForm,deleteForm,previewForm},
    props: ['data', 'id'],
    data() {
        return {}
    },
    computed: {},
    mounted() {

    },
    beforeMount() {
    },
    methods: {

    }
}


