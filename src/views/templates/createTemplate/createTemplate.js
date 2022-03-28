import * as CodeMirror from "codemirror";
import * as template from "../../../controller/templatesController";
export default {
    name: 'create-template',
    components: {
    },
    props: [],
    data() {
        return {
            errors: {},
            message: '',
            name: '',
            query: '',
            group: '',
            variables: '',
            CmQuery:'',
            CmVariables:'',
            cmOption: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'eclipse',
                lineNumbers: true,
                line: true,
            }
        }
    },
    computed: {

    },
    mounted() {
        this.CmVariables = CodeMirror.fromTextArea(document.getElementById("variables"),this.cmOption)
        this.CmVariables.on("change", that=>{
            this.variable = that.getValue();
        });
        this.CmQuery = CodeMirror.fromTextArea(document.getElementById("query"),this.cmOption);
        this.CmQuery.on("change", that=>{
            this.query = that.getValue();
            this.checkQuery();
        });
    },
    async beforeMount(){

    },
    methods: {
        resetForm() {
            this.CmQuery.setValue('');
            this.CmVariables.setValue('');
            this.errors = {};
            this.name = this.query = this.group = this.variables = this.message = '';
        },
        submitForm(e) {
            e.preventDefault();
            this.message = ''
            this.errors = {};
            this.checkName();
            this.checkGroup();
            this.checkQuery();
            if (Object.keys(this.errors).length === 0) {
                this.errors = {};
                template.addTemplate(this.name, this.group, this.query, this.variables).then((r) => {
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
        checkName() {
            if ((this.name).trim() === '') {
                this.errors.name = 'Template name is required.';
            } else {
                delete this.errors.name;
            }
        },
        checkGroup() {
            if ((this.group).trim() === '') {
                this.errors.group = 'Group name is required.';
            } else {
                delete this.errors.group;
            }
        },
        checkQuery() {
            if ((this.query).trim() === '') {
                this.errors.query = 'Query is required.';
            } else {
                delete this.errors.query;
            }
        },
    }
}



