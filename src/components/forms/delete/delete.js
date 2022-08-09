//import $ from 'jquery';
import * as configurationsController from "../../../controller/configurationsController";

export default {
    name: 'delete',
    props: ['structureType', 'refreshFunction', 'viewId', 'modelId'],
    data() {
        return {
            schema: [],
            model: {},
            controls: {},
        }
    },
    computed: {},
    methods: {
        show() {
            this.$modal.show('delete-view-' + this.structureType + this.modelId);
        },
        hide() {
            this.$modal.hide('delete-view-' + this.structureType + this.modelId);
        },
        deleted() {
            if (configurationsController.deleteModel(this.structureType, this.modelId, this.viewId) === true) {
                this.refreshFunction()
                this.hide();
            }
        }
    },
    beforeMount() {

    }
}


