import * as utils from '@/settings/utils'
import * as configurationsController from "@/controller/configurationsController";

export default {
  components: {

  },
  data() {
    return {
      group: 'Hour',
      groupOptions: ['Hour', 'Day', 'Month', 'Year'],
      queryBegin:"",
      to: null,
      from: null,
      date: null,
      active: null,
      nodes: null,
      cardStyle:{},
      cardModels:{},
      chartStyle:{},
      chartModels:{}
    }
  },
  computed: {},
  methods: {
    showGroup() {
      return this.active !== null && this.date !== null
    },
    showDatePicker() {
      return this.active !== null
    },
    async drawCards() {
      const r = configurationsController.getCardModels(this.$route.name)
      if (r.errors !== true) {
        if (r.data.total > 0) {
          this.cardModels = r.data.results
        }
      } else {
        this.cardModels = {};
      }

    },
    async drawCharts() {
      let r = configurationsController.getChartModels(this.$route.name)
      if (r.data.errors !== true) {
        if (r.data.total > 0) {
          this.chartModels = r.data.results;
          let style = configurationsController.getChartStyles(this.$route.name)
          if (style.data.errors !== true) {
            this.chartStyle = null
            this.chartStyle = style.data.results;
          }
        }
      } else {
        this.chartModels = {};
      }
    },
    async setNode (node) {
      this.active = node.target.value
      this.queryBegin = '/nodes/' + this.active;
      this.setDate(this.date)
    },
    setDate(date) {
      if(date!==null){
        this.cardModels = this.chartModels = this.chartStyle = this.cardStyle = {};
        this.date = date;
        utils.refreshDate(date, this);
      }
    },
    async setGroup(event){
      this.group = event.target.value;
      this.setDate(this.date)
    }
  },
  async beforeMount() {
    this.nodes = (await utils.fetchData('/nodes')).map(item => item.node)
  },
  async mounted() {
  }
}