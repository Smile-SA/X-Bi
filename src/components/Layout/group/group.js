
export default {
  name: 'group',
  components: {},
  props: ['that'],
  data () {
    return {
      groupOptions: ['Hour', 'Day', 'Month', 'Year'],
      group:''
    }
  },
  computed: {

  },
  mounted () {
    this.group = this.that.group;
  },
  methods: {
    setGroup(){
      this.that.group = event.target.value;
      this.that.setDate(this.that.date)
    }
  }
}


