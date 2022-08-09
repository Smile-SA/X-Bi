import * as configurationsController from "../../../controller/configurationsController";

export default {
    name: 'add',
    props: ['structureType', 'refreshFunction', 'viewId'],
    data() {
        return {
            schema: [],
            addModel: {},
            controls: {},
        }
    },
    computed: {},
    methods: {
        getFormSchema() {
            let data = configurationsController.getForm(this.structureType);
            if (Object.keys(data).length > 0) {
                this.schema = data
            }
        },
        async show() {
            this.getFormSchema();
            this.$modal.show('view-add' + this.structureType);
        },
        hide() {
            this.$modal.hide('view-add' + this.structureType);
        },
        reset() {
            this.$formulate.reset('add-form'+ this.structureType)
        },
        cancel() {
            this.reset();
            this.hide()
        },
        submitForm(structureType) {
            if (structureType === 'view') {
                this.addModel.path = this.addModel.name.replace(" ", "")
                this.addModel.requiresAuth = true
                this.addModel.structure = {
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
            if (configurationsController.addModel(structureType, this.addModel, this.viewId) === true) {
                this.refreshFunction();
                this.reset();
            }
        },
        showInput(input) {
            let show = input.conditionFields ? input.conditionFields.values.includes(this.addModel[input.conditionFields.id]) ? true : false : true;
            Object.keys(this.schema).map((key) => {
                if (this.schema[key].condition != undefined && this.schema[key].condition === true) {
                    Object.keys(this.schema).map((id) => {
                        if (this.schema[id].conditionFields != undefined) {
                            if (this.schema[id].conditionFields.id === this.schema[key].name) {
                                if (this.schema[id].conditionFields.values.includes(this.addModel[this.schema[key].name])) {
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
    },
    beforeMount() {
    }
}


