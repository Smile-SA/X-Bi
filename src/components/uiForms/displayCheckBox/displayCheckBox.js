import * as configurationsController from "../../../controller/configurationsController";

export default {
    name: 'display-check-box',
    components: {},
    props: ['data'],
    data() {
        return {
            model: {}
        }
    },
    computed: {},
    beforeMount() {
        this.getModel();
    },
    methods: {
        getModel() {
            let data = configurationsController.getModel(this.data.structureType, this.data.viewId);
            if (Object.keys(data).length > 0) {
                this.model = data;
            }
        },
        setDisplay() {
            if (configurationsController.setDynamicViewProperty(this.data.viewId, 'display', this.model.display,)) {
                this.$router.go(this.$router.currentRoute)
            }
        }
    }
}


