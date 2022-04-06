import * as router from "../../../../controller/routerController";
export default {
  name: 'edit-views-display',

  components: {},
  props: ['data'],
  data () {
    return {
      isDisplay:this.data.display
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    setDisplay(){
      router.setDynamicViewProperty(this.data.name,this.isDisplay,'display');
    }
  }
}




