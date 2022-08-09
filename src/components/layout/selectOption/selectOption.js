
export default {
  name: 'select-option',
  components: {},
  props: ['label','selectId','placeholder','selectFunction','selectData','replace','by','type','defaultData'],
  data () {
    return {
    }
  },
  computed: {
    setDate(){
      this.that.setDate(this.that.date)
    }
  },
  mounted () {

  },
  methods: {

  }
}


