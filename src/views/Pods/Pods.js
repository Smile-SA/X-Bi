import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../../components/card/index.vue'),
    BarChart: () => import ('../../components/charts/BarChart'),
  },
  data () {
    return {
      barChartMetrics: null,
      selectPods: null,
      activePod: null,
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
    confCardNamespace() {
      return {
        from: this.from,
        to: this.to,
        link: '/namespaces',
        label: 'Namespace',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16',
        type: 'string',
        key: 'namespace'
      }
    },
    confCardNode() {
      return {
        from: this.from,
        to: this.to,
        link: '/nodes',
        label: 'Node',
        color: 'red',
        icon: 'fa fa-server',
        type: 'string',
        key: 'node'
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
    confCardStart() {
      return {
        from: this.from,
        to: this.to,
        label: 'Started at',
        link: '/',
        color: 'green',
        icon: 'fa fa-hourglass-start',
        type: 'string',
        key: 'start'
      }
    },
    confCardEnd() {
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Last update',
        color: 'red',
        icon: 'fa fa-hourglass-end',
        type: 'string',
        key: 'end'
      }
    },
  },
  methods: {
    getURL(data) {
      utils.getURL(data, this)
    },
    getCardNamespaceUrl() {
      return `${api}/pods/${this.activePod}/namespace`
    },
    getCardNodeUrl() {
      return `${api}/pods/${this.activePod}/node`
    },
    getCardRatingUrl() {
      return `${api}/pods/${this.activePod}/total_rating`
    },
    getCardLifetimeUrl() {
      return `${api}/pods/${this.activePod}/lifetime`
    },
    async getMetrics() {
      return await utils.get(`${api}/pods/${this.activePod}/rating`, this)
    },
    refreshDate(date) {
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activePod !== null
    },
    async getPods (pod) {
      this.cards = []
      this.activePod = pod.target.value
      this.refreshDate(null)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
        {'endpoint': `${api}/metrics`, 'key': 'metric'},
        {'endpoint': `${api}/nodes`, 'key': 'node'}
      ], this)
    }
  },
  async beforeMount() {
    await this.generateColor()
    this.selectPods = (await utils.fetchData(`${api}/pods`, this)).map(item => item.pod)
  },
  async mounted () {}
}