import * as router from "../../../../controller/routerController";

export default {
  name: 'edit-name',
  components: {},
  props: ['data'],
  data() {
    return {
      name : this.data.name
    }
  },
  computed: {},
  mounted() {

  },
  methods: {
    setName() {
      router.setDynamicViewProperty(this.data.name, this.name, 'name');
    }
  }
}






