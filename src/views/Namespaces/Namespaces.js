import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
  components: {
    BarChart : () => import('../../components/charts/BarChart'),
    PieChart : () => import('../../components/charts/PieChart'),
    Card : () => import('../../components/card/index.vue'),
  },
  data () {
    return {
      barChartMetrics: null,
      pieChartNodesPods: null,
      selectForm: null,
      activeNamespace: null,
      colors: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
    }
  },
  computed: {
    isMobile () {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    },
    confBarChartMetrics() {
      return {
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
        colors: this.colors,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Metrics rate (in Euros)'
        }
      }
    },
    confPieChartNodesPods() {
      return {
        graph: this.pieChartNodesPods,
        id: 'pieChartNodesPods',
        sort: 'node',
        colors: this.colors,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Pods repartition per nodes'
        }
      }
    },
    confCardNodes() {
      return {
        from: this.from,
        to: this.to,
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'far fa-lightbulb',
        type: 'number'
      }
    },
    confCardPods() {
      return {
        from: this.from,
        to: this.to,
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'fab fa-cloudversify',
        type: 'number'
      }
    },
    confCardRating() {
      const from = dateformat(this.from, 'dd/mm/yyyy')
      const to = dateformat(this.to, 'dd/mm/yyyy')
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'fa fa-euro-sign',
        message: ` from ${from} to ${to}`,
        type: 'sum',
        key: 'frame_price'
      }
    },

  },
  methods: {
    async getMetrics() {
      return await utils.get(`${api}/namespaces/${this.activeNamespace}/rating`, this)
    },
    async getNodePods() {
      return await utils.get(`${api}/namespaces/${this.activeNamespace}/nodes/pods`, this)
    },
    getCardRatingUrl() {
      return `${api}/namespaces/${this.activeNamespace}/total_rating`
    },
    getCardNodesUrl() {
      return `${api}/namespaces/${this.activeNamespace}/nodes`
    },
    getCardPodsUrl() {
      return `${api}/namespaces/${this.activeNamespace}/pods`
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    refreshDate(date) {
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activeNamespace !== null
    },
    async getNamespaces (namespace) {
      this.activeNamespace = namespace.target.value
      this.refreshDate(null)
      this.test = 1;
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/metrics`, 'key': 'metric'},
        {'endpoint': `${api}/nodes`, 'key': 'node'}
      ], this)
    },
  },
  async beforeMount() {
    await this.generateColor()
    this.selectForm = (await utils.fetchData(`${api}/namespaces`, this)).map(item => item.namespace)
  },
  async mounted () {}
}