import * as configurationsController from "../../../controller/configurationsController";
import FormSchema from '@formschema/native';

export default {
    name: 'view-form',
    components: {FormSchema},
    props: ['structureType','refreshModels','activeView'],
    data() {
        return {
            schema: [],
            model: {},
            controls: {},
        }
    },
    computed: {},
    methods: {
        getFormSchema(structureType) {
            let r = configurationsController.getForm(structureType);
            if (Object.keys(r.data).length > 0) {
                this.schema = r.data.results
            }
        },
        show() {
            this.$modal.show('view-'+this.structureType);
        },
        hide() {
            this.$modal.hide('view-'+this.structureType);
        },
        reset() {
            this.$formulate.reset('form')
        },
        cancel() {
            this.reset();
            this.hide()
        },
        submitForm(structureType) {
            if(structureType === 'view'){
                this.model.path = this.model.name.replace(" ", "")
                this.model.displayInMenu = true
                this.model.requiresAuth = true
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
            let r = configurationsController.addModel(structureType, this.model,this.activeView);
            if(r.data.results === true){
                this.reset();
                this.refreshModels()
            }
        },
        updateValidationrequired() {
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
        showInput(input) {
            this.updateValidationrequired();
            return input.conditionFields ? input.conditionFields.values.includes(this.model[input.conditionFields.id]) ? true : false : true
        },
    },
    beforeMount() {
        this.getFormSchema(this.structureType);
    }
}


