
export default {
  name: 'select-option',
  components: {},
  props: ['label','selectId','placeholder','selectFunction','selectData','replace','by','type','defaultData','id'],
  data () {
    return {
      defaultSelect : ''
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


