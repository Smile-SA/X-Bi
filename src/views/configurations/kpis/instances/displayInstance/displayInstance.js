import * as instance from "../../../../../controller/instancesController";
import * as CodeMirror from "codemirror";
import * as general from "../../../../../controller/genaralController";


export default {
    name: 'display-instance',
    components: {},
    props: [],
    data() {
        return {
            'id': '',
            value: '',
            message: '',
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
    computed: {},
    methods: {
        display() {
            this.model = '';
            instance.getInstance(this.id).then((r) => {
                if (r.errors) {
                    document.getElementById('value').style.display = 'none';
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
    },
    async beforeMount() {
        general.titleBoxRender(this)
        this.id = this.$route.params.id;
        this.display();
    },
}


