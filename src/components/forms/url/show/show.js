import * as general from "../../../../controller/generalController";
import * as CodeMirror from "codemirror";
import * as uiConfigurations from "@/uiConfigurations.json";

const apiInfo = uiConfigurations.apiInfo;

export default {
  name: 'show',
  components: {},
  props: ['url','refreshFunction','id','value', 'data'],
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
      const localStorageData = JSON.parse(localStorage.getItem('x-bi:' + this.data.name));
      if (localStorageData) {
        this.value = this.data.name;
        this.cmValue = CodeMirror.fromTextArea(document.getElementById("value"), this.cmOption);
        this.cmValue.setValue(JSON.stringify(localStorageData.data.results, null, 2));
        this.cmValue.on('copy', (cm, e) => {
          e.codemirrorIgnore = true;
        });
      }
      else {
        general.getById(this.url, this.id, this.value, apiInfo.dataType === 'static').then((r) => {
          this.cmValue = CodeMirror.fromTextArea(document.getElementById("value"), this.cmOption);
          this.cmValue.setValue(JSON.stringify(r.data.results, null, 2));
          this.cmValue.on('copy', (cm, e) => {
            e.codemirrorIgnore = true;
          });
        });
      }
    },
    async show() {
      await this.$modal.show('preview-modal-' + this.id + this.value);
      this.$nextTick(() => {
        this.getDate();
      });
    },
    hide() {
      this.$modal.hide('preview-modal-' + this.id + this.value);
    },
  }
}


