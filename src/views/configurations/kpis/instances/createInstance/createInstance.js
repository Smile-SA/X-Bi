import * as instance from "../../../../../controller/instancesController";
import * as template from "../../../../../controller/templatesController";
import * as utils from "../../../../../settings/utils";

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
            templatesList: {},
            dynamicValues: [{
                'name': 'timeframe',
                'value': '5',
                'error': '',
            }],
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
        async setDynamicValues(options) {
            this.getDynamicsData(options.target.value)
        },
        async getDynamicsData(value){
            this.dynamicValues = [];
            await template.getTemplate(value).then((r) => {
                if (r.data.total > 0) {
                    let valuesInit = utils.getUnique(r.data.results.spec.query_template.match(/[^{}]+(?=})/g))
                    Object.keys(valuesInit).map((item) => {
                        if(valuesInit[item].replace(/[^a-z0-9]+/gi,' ')===valuesInit[item]){
                            this.dynamicValues.push({
                                    'name': valuesInit[item],
                                    'value': '',
                                    'error': ''
                                }
                            )
                        }
                    });
                }
            });
            this.dynamicValues.push({
                'name': 'timeframe',
                'value': '5',
                'error': '',
            });
        },
        getTemplates() {
            this.templatesList = {}
            template.getTemplates().then((r) => {
                this.templatesNb = r.total;
                if(r.total>0){
                    this.templatesList = r.results;
                }
            });
        },
        checkValues(e) {
            if ((e.target.value).trim() === '') {
                Object.keys(this.dynamicValues).map((item) => {
                    if (this.dynamicValues[item].name === e.target.name) {
                        this.dynamicValues[item].error = this.errors[this.dynamicValues[item].name] = 'Instance ' + this.dynamicValues[item].name + ' is required';
                    } else {
                        this.dynamicValues[item].error = '';
                        delete this.errors[this.dynamicValues[item].name];
                    }
                })
            }
        },
        checkAllValues() {
            if (this.dynamicValues !== null) {
                Object.keys(this.dynamicValues).map((item) => {
                    if ((this.dynamicValues[item].value).trim() === '') {
                        this.dynamicValues[item].error = this.errors[this.dynamicValues[item].name] = 'Instance ' + this.dynamicValues[item].name + ' is required';
                    } else {
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
            this.dynamicValues = [];
            this.errors = {};
            this.name = this.message = '';
        },
        async submitForm(e) {
            e.preventDefault();
            this.message = ''
            this.errors = {};
            this.checkAllForm();
            if (Object.keys(this.errors).length === 0) {
                this.errors = {};
                let data = [];
                Object.keys(this.dynamicValues).map((key) => {
                        data.push({
                            'name': this.dynamicValues[key].name,
                            'value': this.dynamicValues[key].value
                        })
                })
                data.push({
                    'name': 'metric_name',
                    'value': (this.name).replaceAll(' ','')
                })
                data.push({
                    'name': 'template_name',
                    'value': (this.template).replaceAll('rating-rule-template-', '')
                })
                instance.addInstance(data).then((r) => {
                    if (r.errors) {
                        this.errors.submit = true;
                        this.errors.name = r.message.replaceAll(' ','').split('"reason":"').pop().split('"')[0].replace(/[A-Z]/g, ' $&').trim();
                        this.getDynamicsData(this.template)
                    } else {
                        this.resetForm();
                        this.errors.submit = false
                        this.message = r.message
                    }
                });
            }
        },
    }
}



