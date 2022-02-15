import * as utils from '../../settings/utils'
import * as configurationsController from "../../controller/configurationsController";

export default {
  components: {
    Card: () => import('../../components/Layout/card'),
    LineChart: () => import ('../../components/charts/charts.js/LineChart'),
    BarChart: () => import ('../../components/charts/charts.js/BarChart'),
    ApexCharts: () => import ('../../components/charts/apexchart.js/apexcharts'),
    GroupBy: () => import ('../../components/Layout/group/index'),
    DatePicker: () => import ('../../components/Layout/datePicker/index'),
    SelectOption: () => import ('../../components/Layout/selectOption/index'),
  },
  data() {
    return {
      group:'Hour',
      date: null,
      nodes: null,
      activeNode: null,
      cardModels: {},
      chartModels: {},
      chartStyle: {},
      cardStyle: {},
      to: null,
      from: null,
    }
  },
  computed: {},
  methods: {
    showGroup() {
      return this.activeNode !== null && this.date !== null
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async setNode (node) {
      this.activeNode = node.target.value
      this.setDate(this.date)
    },
    async drawCards() {
      const r = configurationsController.getCardModels(this.$route.name)
      if (r.errors !== true) {
        if (r.data.total > 0) {
          this.cardModels = r.data.results
          if(this.activeNode!==null){
            await Object.keys(this.cardModels).map((item) => {
              this.cardModels[item].queryBegin = '/nodes/' + this.activeNode;
            })
          }
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
          if(this.activeNode!==null){
            await Object.keys(this.chartModels).map((item) => {
              this.chartModels[item].queryBegin = '/nodes/' + this.activeNode;
            })
          }
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
    setDate(date) {
      if(date!==null){
        this.cardModels = this.chartModels = this.chartStyle = this.cardStyle = {};
        this.date = date;
        utils.refreshDate(date, this);
      }
    },
  },
  async beforeMount() {
    this.nodes = (await utils.fetchData('/nodes')).map(item => item.node)
  },
  async mounted() {
  }
}