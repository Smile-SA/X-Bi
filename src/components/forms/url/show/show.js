import * as general from "../../../../controller/generalController";
import * as CodeMirror from "codemirror";

export default {
  name: 'show',
  components: {},
  props: ['url','refreshFunction','id','value'],
  data () {
    return {
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
  computed: {

  },
  mounted(){
  },
  methods: {
    getDate(){
      general.getById(this.url, this.id, this.value).then((r) => {
        this.cmValue = CodeMirror.fromTextArea(document.getElementById("value"), this.cmOption);
        this.cmValue.setValue(JSON.stringify(r.data.results, null, 2));
        this.cmValue.on('copy', (cm, e) => {
          e.codemirrorIgnore = true;
        });
      });
    },
    async show() {
      this.getDate();
      await this.$modal.show('preview-modal-' + this.id + this.value);
    },
    hide() {
      this.$modal.hide('preview-modal-' + this.id + this.value);
    },
  }
}


