import * as configurationsController  from "../../../../controller/configurationsController";

export default {
  name: 'edit-requires',

  components: {},
  props: ['data'],
  data() {
    return {
      isRequires : this.data.requiresAuth
    }
  },
  computed: {},
  mounted() {

  },
  methods: {
    setRequiresAuth() {
      configurationsController.setDynamicViewProperty(this.data.name, this.isRequires, 'requiresAuth');
    }
  }
}





