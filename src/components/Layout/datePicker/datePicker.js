export default {
  name: 'date-picker',
  components: {
  },
  props: ['that'],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    setDate(){
      this.that.setDate(this.that.date)
    }
  }
}


