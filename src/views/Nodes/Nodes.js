import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../../components/include/card/index.vue'),
    LineChart: () => import ('../../components/charts/LineChart'),
    BarChart: () => import ('../../components/charts/BarChart'),
  },
  data () {
    return {
      dateRange: null,
      lineChartNamespaces: null,
      barChartMetrics: null,
      selectNodes: null,
      activeNode: null,
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
    confLineChartNameSpace () {
      return {
        url: `${api}/nodes/${this.activeNode}/namespaces/rating`,
        id: 'lineChartNamespaces',
        sort: 'namespace',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Slices rates (in Euros)'
        }
      }
    },
    confCardNamespaces() {
      return {
        from: this.from,
        to: this.to,
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16',
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
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'fa fa-euro-sign',
        message: ` from ${dateformat(this.from, 'dd/mm/yyyy')} to ${dateformat(this.to, 'dd/mm/yyyy')}`,
        type: 'sum',
        key: 'frame_price'
      }
    },

    nameSpaceData() {
      return this.getNamespaces();
    }
  },
  methods: {
    getCardNamespacesUrl() {
      return `${api}/nodes/${this.activeNode}/namespaces`
    },
    getCardPodsUrl() {
      return `${api}/nodes/${this.activeNode}/pods`
    },
    getCardRatingUrl() {
      return `${api}/nodes/${this.activeNode}/total_rating`
    },
    async getMetrics() {
      return await utils.get(`${api}/nodes/${this.activeNode}/rating`, this);
    },
    async getNamespaces() {
      if (!this.activeNode) {
        return {total: 0, results: []}
      }
      return await utils.get(`${api}/nodes/${this.activeNode}/namespaces/rating`, this)
    },
    refreshDate(date) {
      if (date) {
        this.dateRange = date;
      }
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async getNodes (node) {
      this.activeNode = node.target.value
      this.refreshDate(null)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
        {'endpoint': `${api}/metrics`, 'key': 'metric'}
      ], this)
    },
  },
  async beforeMount() {
    await this.generateColor()
    this.selectNodes = (await utils.fetchData(`${api}/nodes`, this)).map(item => item.node)
  },
  async mounted () {}
}