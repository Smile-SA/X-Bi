import * as configurationsController from "../../../../controller/configurationsController";

export default {
    name: 'edit',
    props: ['modelId', 'structureType', 'refreshFunction', 'viewId'],
    data() {
        return {
            schema: [],
            model: {},
            controls: {},
        }
    },
    computed: {
        lookModel () {
            return this.model
        }
    },
    methods: {
        show() {
            this.getModel();
            this.$modal.show('edit-modal-' + this.structureType + this.modelId);
        },
        cancel() {
            this.getModel()
            this.$modal.hide('edit-modal-' + this.structureType + this.modelId);
        },
        getModel() {
            let data = configurationsController.getModel(this.structureType, this.viewId, this.modelId);
            if (Object.keys(data).length > 0) {
                this.model = data;
            }
        },
        showInput(input) {
            return configurationsController.showInputInModel(input,this.model);
        },
        submitForm(structureType) {
            if (structureType === 'view') {
                this.model.path = '/' + this.model.name.replace(" ", "")
            }
            if (configurationsController.editModel(structureType, this.viewId, this.model, this.modelId) === true) {
                this.refreshFunction();
                this.$modal.hide('edit-modal-' + this.structureType + this.modelId);
                if(structureType ==='view'){
                    this.$router.go(this.$router.currentRoute)
                }
            }
        },
        getFormSchema(structureType) {
            let data = configurationsController.getForm(structureType);
            if (Object.keys(data).length > 0) {
                this.schema = data
            }
        },
    },
    watch: {
        lookModel() {
            configurationsController.updateValidation(this.schema, this.model);
        }
    },
    beforeMount() {
        this.getFormSchema(this.structureType);
    }
}





