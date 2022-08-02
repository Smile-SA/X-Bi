import * as CodeMirror from "codemirror";
import * as template from "../../../../../controller/templatesController";
import * as utils from "../../../../../settings/utils";
export default {
    name: 'display-template',
    components: {},
    props: [],
    data() {
        return {
            id:'',
            value: '',
            message:'',
            cmValue: '',
            hover: true,
            cmOption: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'eclipse',
                lineNumbers: true,
                line: true,
                readOnly: 'nocursor'
            }
        }
    },
    async beforeMount(){
        utils.titleBoxRender(this)
        this.id = this.$route.params.id;
        this.display();
    },
    methods: {
        display() {
            this.model='';
            template.getTemplate(this.id).then((r) => {
                if (r.errors) {
                    document.getElementById('value').style.display='none';
                    this.message = r.message
                } else {
                    if (r.data.total > 0) {
                        this.cmValue = CodeMirror.fromTextArea(document.getElementById("value"), this.cmOption);
                        this.cmValue.setValue(JSON.stringify(r.data.results, null, 2));
                        this.cmValue.on('copy', (cm, e) => {
                            e.codemirrorIgnore = true;
                        });
                    }
                }
            });
        },

    }
}


