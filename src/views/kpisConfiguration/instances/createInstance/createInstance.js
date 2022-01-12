import * as instance from "../../../../controller/instancesController";
import * as template from "../../../../controller/templatesController";
import * as utils from "../../../../settings/utils";

export default {
    name: 'create-instance',
    components: {},
    props: [],
    data() {
        return {
            errors: {},
            message: '',
            name: '',
            template: '',
            templatesList: [],
            dynamicValues: null,
            templatesNb: 0,
        }
    },
    computed: {},
    mounted() {

    },
    async beforeMount() {
        this.getTemplates();
    },
    methods: {
        getDynamicValues(options) {
            let value = options.target.value;
            template.getTemplate(value).then((r) => {
                if (r.data.total > 0) {
                    this.dynamicValues=[];
                    let valuesInit = utils.getUnique(r.data.results.spec.query_template.match(/[^{}]+(?=})/g))
                    Object.keys(valuesInit).map((item) => {
                        this.dynamicValues.push({
                                'name':valuesInit[item],
                                'value':'',
                                'error':'',
                            }
                        )
                    })
                }
            });
        },
        getTemplates() {
            template.getTemplates().then((data) => {
                this.templatesNb = data.total;
                this.templatesList = data.results;
            });
        },
        checkValues(e) {
            if ((e.target.value).trim() === '') {
                Object.keys(this.dynamicValues).map((item) => {
                    if(this.dynamicValues[item].name === e.target.name){
                        this.dynamicValues[item].error = this.errors[this.dynamicValues[item].name] = 'Instance '+ this.dynamicValues[item].name +' is required';
                    }
                    else {
                        this.dynamicValues[item].error = '';
                        delete this.errors[this.dynamicValues[item].name];
                    }
                })
            }
        },
        checkAllValues() {
                if(this.dynamicValues!==null){
                    Object.keys(this.dynamicValues).map((item) => {
                        if( (this.dynamicValues[item].value).trim() === ''){
                            this.dynamicValues[item].error = this.errors[this.dynamicValues[item].name] = 'Instance '+ this.dynamicValues[item].name +' is required';
                        }
                        else {
                            this.dynamicValues[item].error = '';
                            delete this.errors[this.dynamicValues[item].name];
                        }
                    })
                }
        },
        checkName() {
            if ((this.name).trim() === '') {
                this.errors.name = 'Instance name is required.';
            } else {
                delete this.errors.name;
            }
        },
        checkTemplate() {
            if ((this.template).trim() === '') {
                this.errors.template = 'Template is required.';
            } else {
                delete this.errors.template;
            }
        },
        checkAllForm() {
            this.checkName();
            this.checkTemplate();
            this.checkAllValues();
        },
        resetForm() {
            this.errors = {};
            this.name = this.message = '';
            this.dynamicValues=[];
        },
        submitForm(e) {
            e.preventDefault();
            this.message = ''
            this.errors = {};
            this.checkAllForm();
            if (Object.keys(this.errors).length === 0) {
                this.errors = {};
                instance.addInstance(this.name, (this.template).replace('rating-rule-template-', ''), this.cpu, this.memory, this.price, this.timeframe).then((r) => {
                    if (r.errors) {
                        this.errors.submit = true
                    } else {
                        this.resetForm();
                        this.errors.submit = false
                    }
                    this.message = r.message
                });
            }
        },
    }
}



