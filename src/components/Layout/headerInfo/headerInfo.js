import * as utils from '../../../settings/utils'
export default {
  name: 'header-info',
  components: {},
  props: [],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    go(link){
      utils.goTo(link,this)
    }
  }
}


