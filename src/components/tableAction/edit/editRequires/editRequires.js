import * as router from "../../../../controller/routerController";

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
      router.setDynamicViewProperty(this.data.name, this.isRequires, 'requiresAuth');
    }
  }
}





