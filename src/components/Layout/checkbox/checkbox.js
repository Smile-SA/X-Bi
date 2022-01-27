import * as router from "../../../controller/routerController";
export default {
  name: 'checkbox',
  components: {},
  props: ['data'],
  data () {
    return {
      'isDisplay':this.data.display
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
      Display(){
        router.setDisplay(this.data.id,this.isDisplay);
      }

  }
}


