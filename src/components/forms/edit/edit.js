import * as configurationsController from "../../../controller/configurationsController";

export default {
    name: 'edit',
    props: ['modelId', 'structureType', 'refreshFunction', 'viewId'],
    data() {
        return {
            schema: [],
            model: {},
            lastModel: {},
            controls: {},
        }
    },
    computed: {},
    methods: {
        getFormSchema(structureType) {
            let data = configurationsController.getForm(structureType);
            if (Object.keys(data).length > 0) {
                this.schema = data
            }
        },
        show() {
            this.getModel();
            this.$modal.show('edit-modal-' + this.structureType + this.modelId);
        },
        hide() {
            this.$modal.hide('edit-modal-' + this.structureType + this.modelId);
        },
        reset() {
            this.$formulate.reset('edit-form-' + this.structureType + this.modelId)
        },
        cancel() {
            this.hide();
        },
        submitForm(structureType) {
            if (structureType === 'view') {
                this.model.displayInMenu = this.lastModel.displayInMenu
                this.model.requiresAuth = this.lastModel.displayInMenu
                this.model.structure = this.lastModel.structure
                this.model.path = '/' + this.model.name.replace(" ", "")
            }
            if (configurationsController.editModel(structureType, this.viewId, this.model, this.modelId) === true) {
                this.refreshFunction();
                this.hide();
            }
        },
        showInput(input) {
            let show = input.conditionFields ? input.conditionFields.values.includes(this.model[input.conditionFields.id]) ? true : false : true;
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
            return show;
        },
        getModel() {
            let data = configurationsController.getModel(this.structureType, this.viewId, this.modelId);
            if (Object.keys(data).length > 0) {
                this.lastModel = data;
            }
        },
    },
    beforeMount() {
        this.getFormSchema(this.structureType);
    }
}





