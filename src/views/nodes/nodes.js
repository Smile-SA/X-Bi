import * as utils from '../../settings/utils'
import * as genaralController from "../../controller/genaralController";

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
      nodeMetrics: {},
      nameSpaceMetrics: {},
      group:'Hour',
      date: null,
      lineChartNamespaces: null,
      barChartMetrics: null,
      nodes: null,
      activeNode: null,
      confCardNamespaces: {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Namespaces',
        colorLabel: 'success',
        icon: 'mdi mdi-share-variant',
        type: 'number',
        color: '#0cceb0',
        value: 0,
      },
      confCardPods: {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Pods',
        colorLabel: 'primary',
        icon: 'mdi mdi-sitemap',
        type: 'number',
        color: '#1eaae1',
        value: 0,
      },
      confCardRating: {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Rating',
        colorLabel: 'danger',
        color: '#fe7c96',
        value: 0,
        icon: 'mdi mdi-currency-eur',
        type: 'sum',
        key: 'frame_price',
      },
      colors: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
    }
  },
  computed: {
    isMobile() {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    },
    confChartNodesMetrics() {
      return {
        id: 'barChartMetrics',
        type: 'area',
        height: 450,
        fontSize: '20px',
        sort: 'metric',
        xaxis: {
          type: 'datetime'
        },
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Metrics rate (in Euros)'
        }
      }
    },
    confChartNameSpaceMetrics() {
      return {
        id: 'areaChartNamespaces',
        type: 'area',
        height: 450,
        fontSize: '20px',
        sort: 'namespace',
        xaxis: {
          type: 'datetime'
        },
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Slices rates (in Euros)'
        }
      }
    },

  },
  methods: {
    getNodesMetricsToApex() {
      this.nodeMetrics.height=undefined;
      genaralController.getDataByVariableAndDateToApex('/nodes/'+this.activeNode+'/rating', this.confChartNodesMetrics, this).then(async (r) => {
        if (r.total > 0) {
          this.nodeMetrics = r;
        }
      });
    },
    getNamespacesMetricsToApex() {
      this.nameSpaceMetrics.height=undefined;
      genaralController.getDataByVariableAndDateToApex('/nodes/'+this.activeNode+'/namespaces/rating', this.confChartNameSpaceMetrics, this).then(async (r) => {
        if (r.total > 0) {
          this.nameSpaceMetrics = r;
        }
      });
    },
    setDate(date) {
      if(date!==null){
        this.date = date;
        utils.refreshDate(date, this);
      }
    },
    showGroup() {
      return this.activeNode !== null && this.date !== null
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async setNode (node) {
      this.cards = []
      this.activeNode = node.target.value
      this.setDate(this.date)
    },
    async drawCards() {
      await genaralController.getJsonData('/nodes/' + this.activeNode + '/total_rating').then(async (r) => {
        this.confCardRating.value = (r.results.length === 1) ?
            r.results[0][this.confCardRating.key].toFixed(2) :
            r.results.map(item => item[this.confCardRating.key]).reduce((a, b) => a + b, 0).toFixed(2)
      });
      await genaralController.getJsonData('/nodes/' + this.activeNode + '/pods').then(async (r) => {
        this.confCardPods.value = r.total;
      });
      await genaralController.getJsonData('/nodes/' + this.activeNode + '/namespaces').then(async (r) => {
        this.confCardNamespaces.value = r.total;
      });
    },
    async drawGraphs() {
      await this.getNodesMetricsToApex();
      await this.getNamespacesMetricsToApex();
    },

  },
  async beforeMount() {
    this.nodes = (await utils.fetchData('/nodes')).map(item => item.node)
  },
  async mounted() {
  }
}