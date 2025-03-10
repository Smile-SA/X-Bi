import * as configurationsController from "../../../../controller/configurationsController";
import * as general from "../../../../controller/genaralController";

export default {
    name: 'add',
    components: {},
    props: ['structureType', 'refreshFunction', 'id', 'url'],
    data() {
        return {
            form: [],
            model: {},
            showForm:false,
            errors: {},
            message: '',
            controls: {},
        }
    },
    computed: {
        lookModel() {
            return this.model
        }
    },

    methods: {
        async show() {
            this.errors = {};
            this.message = '';
            this.form = await this.getForm();
            this.showForm = true
            await this.$modal.show('view-add' + this.structureType);
        },
        cancel() {
            this.errors = {}
            this.message = ''
            this.$formulate.reset('add-form' + this.structureType)
            this.$modal.hide('view-add' + this.structureType);
            this.showForm = false
            this.deleteDynamicInput();
        },
        async getForm() {
            return await configurationsController.getForm(this.structureType);
        },
        async showInput(input) {
            return await configurationsController.showInputInModel(input, this.model);
        },
        submitForm() {
            this.errors = {},
                this.message = '',
                // eslint-disable-next-line no-unused-vars
                general.generalAdd(this.url, this.model).then((r) => {
                    if (r.errors) {
                        this.errors.submit = true;
                    } else {
                        this.deleteDynamicInput();
                        this.$formulate.reset('add-form' + this.structureType);
                        this.errors.submit = false;
                    }
                    this.refreshFunction();
                    this.message = r.message;
                });
        },
        deleteDynamicInput() {
            let tabDel = [];
            Object.keys(this.form).map((key) => {
                if (this.form[key].isDynamic && this.form[key].isDynamic === true) {
                    tabDel.push(key)
                }
            })
            this.form.length = this.form.length - tabDel.length
        },
        changeForm(input) {
            if (input.dynamicFields) {
                this.deleteDynamicInput();
                configurationsController.dynamicInputs(this.form, this.model);
            }
        }
    },
    watch: {
        lookModel() {
            configurationsController.updateValidation(this.form, this.model);
        }
    },
    async beforeMount() {
    }
}


