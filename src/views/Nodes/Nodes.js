import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../../components/include/card/index.vue'),
    LineChart: () => import ('../../components/charts/LineChart'),
    BarChart: () => import ('../../components/charts/BarChart'),
    ApexCharts: () => import ('../../components/apexCharts/index.vue'),
  },
  data () {
    return {
      metricsSeries: null,
      metricsOptions: null,
      metricsHeight: 0,
      nameSpaceSeries: null,
      nameSpaceOptions: null,
      nameSpaceHeight: 0,
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
    confCardNamespaces() {
      return {
        from: this.from,
        to: this.to,
        link: '/namespaces',
        label: 'Namespaces',
        color: 'primary',
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
        color: 'success',
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
        color: 'warning',
        icon: 'fa fa-euro-sign',
        message: ` from ${dateformat(this.from, 'dd/mm/yyyy')} to ${dateformat(this.to, 'dd/mm/yyyy')}`,
        type: 'sum',
        key: 'frame_price'
      }
    },
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
    async getNamespaces() {
      if (!this.activeNode) {
        return {total: 0, results: []}
      }
      return await utils.get(`${api}/nodes/${this.activeNode}/namespaces/rating`, this)
    },
    refreshMetrics() {
      this.metricsSeries = []
      utils.fetchDataAsJSON(`${api}/nodes/${this.activeNode}/rating`, this).then((value) => {
        if (value.total > 0) {
          let c = {
            graph: this.barChartMetrics,
            id: 'barChartMetrics',
            sort: 'metric',
            colors: this.colors,
            labels: {
              time: 'frame_begin',
              value: 'frame_price',
              title: 'Metrics rate (in Euros)'
            }
          };
          const dataset = utils.groupBy(value.results, c.sort);
          const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

          labels.forEach((item, count) => {
            labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
          })
          let min = 0
          let max = 0
          Object.keys(dataset).forEach(item => {
            const obj = []
            Object.values(dataset[item]).forEach(subItem => {
              const fixed = subItem[c.labels.value].toFixed(5)
              const minTmp = Math.min(fixed)
              const maxTmp = Math.max(fixed)
              if (min === 0 || minTmp < min) {
                min = minTmp
              }
              if (max === 0 || maxTmp > max) {
                max = maxTmp
              }
              obj.push(fixed)
            })
            this.metricsSeries.push({
              name: item,
              data: obj
            });
            this.metricsOptions = {
              chart: {
                id: c.id, type: 'area'
              },
              xaxis: {
                categories: labels,
              },
              dataLabels: {
                enabled: false
              },

              title: {
                text: c.labels.title,
                style: {
                  fontSize: '20px',
                },
              }
            };
            this.metricsHeight = 350;
          })
        }
      });
    },
    refreshNameSpace() {
      this.nameSpaceSeries = []
      utils.fetchDataAsJSON(`${api}/nodes/${this.activeNode}/namespaces/rating`, this).then((value) => {
        if (value.total > 0) {
          let c =  {
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
          };
          const dataset = utils.groupBy(value.results, c.sort);
          const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

          labels.forEach((item, count) => {
            labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
          })
          let min = 0
          let max = 0
          Object.keys(dataset).forEach(item => {
            const obj = []
            Object.values(dataset[item]).forEach(subItem => {
              const fixed = subItem[c.labels.value].toFixed(5)
              const minTmp = Math.min(fixed)
              const maxTmp = Math.max(fixed)
              if (min === 0 || minTmp < min) {
                min = minTmp
              }
              if (max === 0 || maxTmp > max) {
                max = maxTmp
              }
              obj.push(fixed)
            })
            this.nameSpaceSeries.push({
              name: item,
              data: obj
            });
            this.nameSpaceOptions = {
              chart: {
                id: c.id, type: 'area'
              },
              xaxis: {
                categories: labels,
              },
              dataLabels: {
                enabled: false
              },

              title: {
                text: c.labels.title,
                style: {
                  fontSize: '20px',
                },
              }
            };
            this.nameSpaceHeight = 350;
          })
        }
      });
    },
    async refreshDate(date) {
      if (date) {
        this.dateRange = date;
      }
      utils.refreshDate(date, this);
      await this.refreshMetrics()
      await this.refreshNameSpace()
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
    await this.generateColor();
    this.selectNodes = (await utils.fetchData(`${api}/nodes`, this)).map(item => item.node)
  },
  async mounted () {}
}