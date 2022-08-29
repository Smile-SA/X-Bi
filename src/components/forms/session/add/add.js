import * as configurationsController from "../../../../controller/configurationsController";

export default {
    name: 'add',
    props: ['structureType', 'refreshFunction', 'viewId'],
    data() {
        return {
            schema: [],
            model: {},
            controls: {},
        }
    },
    computed: {
        lookModel () {return this.model}
    },
    methods: {
        show() {
            this.getFormSchema();
            this.$modal.show('view-add' + this.structureType);
        },
        cancel() {
            this.$formulate.reset('add-form'+ this.structureType)
            this.$modal.hide('view-add' + this.structureType);
        },
        getFormSchema() {
            let data = configurationsController.getForm(this.structureType);
            if (Object.keys(data).length > 0) {
                this.schema = data
            }
        },
        showInput(input) {
            return configurationsController.showInputInModel(input,this.model);
        },
        submitForm(structureType) {
            if (structureType === 'view') {
                this.model.path = this.model.name.replace(" ", "")
                this.model.requiresAuth = true
                this.model.displayInMenu = true
                this.model.structure = {
                    "select": {
                        "models": [],
                        "styles": {}
                    },
                    "card": {
                        "models": [],
                        "styles": {}
                    },
                    "chart": {
                        "models": [],
                        "styles": {
                            "height": "500",
                            "font_size": "20px"
                        }
                    }
                }
            }
            if (configurationsController.addModel(structureType, this.model, this.viewId) === true) {
                this.refreshFunction();
                this.$formulate.reset('add-form'+ this.structureType)
                if(structureType ==='view'){
                    this.$router.go(this.$router.currentRoute)
                }
            }
        },
    },
    watch: {
        lookModel() {
            configurationsController.updateValidation(this.schema, this.model);
        }
    },
}


