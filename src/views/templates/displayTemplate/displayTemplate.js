import {getTemplate} from "../../../controller/templatesController";
import * as CodeMirror from "codemirror";

export default {
    name: 'display-template',
    components: {},
    props: [],
    data() {
        return {
            'id':'',
            value: '',
            message:'',
            cmValue: '',
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
    computed: {},
    mounted() {

    },
    async beforeMount(){
        this.id = this.$route.params.id;
        this.display();
    },
    methods: {
        display() {
            this.model='';
            getTemplate(this.id).then((r) => {
                if (r.errors) {
                    document.getElementById('value').style.display='none';
                    this.message = r.message
                    //
                } else {
                    if (r.data.total > 0) {

                        this.cmValue = CodeMirror.fromTextArea(document.getElementById("value"), this.cmOption);
                        this.cmValue.setValue(JSON.stringify(r.data.results, null, 2));
                        this.cmValue.on('copy', (cm, e) => {
                            // ignore copy by codemirror.  and will copy by browser
                            e.codemirrorIgnore = true;
                        });
                    }
                }
            });
        },
    }
}


