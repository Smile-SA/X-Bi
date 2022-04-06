import * as router from "../../../../controller/routerController";

export default {
  name: 'edit-description',

  components: {},
  props: ['data'],
  data() {
    return {
      description : this.data.description
    }
  },
  computed: {},
  mounted() {

  },
  methods: {
    setDescription() {
      router.setDynamicViewProperty(this.data.description, this.description, 'description');
    }
  }
}






