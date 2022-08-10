import * as configurationsController from "../../../controller/configurationsController";

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
            let show = input.conditionFields ? input.conditionFields.values.includes(this.model[input.conditionFields.id]) ? true : false : true;
            return show;
        },
        updateValidation() {
            Object.keys(this.schema).map((key) => {
                if (this.schema[key].condition != undefined && this.schema[key].condition === true) {
                    Object.keys(this.schema).map((id) => {
                        if (this.schema[id].conditionFields != undefined) {
                            if (this.schema[id].conditionFields.id === this.schema[key].name) {
                                if (this.schema[id].conditionFields.values.includes(this.model[this.schema[key].name])) {
                                    this.schema[id].validation = this.schema[id].conditionFields.validation
                                } else {
                                    this.schema[id].validation = ''
                                }
                            }
                        }
                    });
                }
            });
        },
        submitForm(structureType) {
            if (structureType === 'view') {
                this.model.path = '/' + this.model.name.replace(" ", "")
            }
            if (configurationsController.editModel(structureType, this.viewId, this.model, this.modelId) === true) {
                this.refreshFunction();
                this.$modal.hide('edit-modal-' + this.structureType + this.modelId);
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
            this.updateValidation()
        }
    },
    beforeMount() {
        this.getFormSchema(this.structureType);
    }
}





