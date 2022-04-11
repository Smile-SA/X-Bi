import * as utils from '../../../../settings/utils'
export default {
  name: 'edit-structure',
  components: {},
  props: ['data'],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    goTo(id){
      utils.goTo('/structure/:'+id,this)
    }
  }
}


