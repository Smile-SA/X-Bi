import * as configurationsController  from "../../../../controller/configurationsController";

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
      if(configurationsController.setDynamicViewProperty(this.data.name,this.isDisplay,'display')){
        this.$router.go(this.$router.currentRoute)
      }
    }
  }
}




