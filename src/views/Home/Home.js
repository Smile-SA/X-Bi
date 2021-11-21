import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'
import {fetchDataAsJSONNamespace} from "../../utils";

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../../components/card/index.vue'),
    LineChart: () => import ('../../components/charts/LineChart'),
    ApexCharts: () => import ('../../components/apexCharts/index.vue'),
  },
  data() {
    return {
      date: null,
      lineChartNodes: null,
      apexChartOptions: {
        chart: {
          id: 'vuechart-example',type:"area"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      apexChartSeries:[{
        name: 'Vue Chart',
        data: [30, 40, 45, 50, 49, 60, 70, 81]
      },{
        name: 'Vue Chart',
        data: [80, 40, 45, 50, 99, 60, 70, 81]
      }],
      lineChartNamespaces: null,
      dateRange: null,
      colors: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
    }
  },
  computed: {

    isMobile() {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    },
    confLineChartNameSpace() {
      return {
        id: 'lineChartNamespaces',
        sort: 'namespace',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Slices rate (in Euros)'
        }
      }
    },
    confLineChartNodes() {
      return {
        id: 'lineChartNodes',
        sort: 'node',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Nodes rate (in Euros)'
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
        icon: 'fa fa-sitemap',
        type: 'number'
      }
    },
    confCardNodes() {
      return {
        from: this.from,
        to: this.to,
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'fa fa-server',
        type: 'number'
      }
    },
  },
  methods: {
    async getNodes() {
      return await utils.fetchDataAsJSON(`${api}/nodes/rating`, this);
    },
    async getNamespaces() {
      return await utils.fetchDataAsJSON(`${api}/namespaces/rating`, this);
    },
    async getNamespacesApex() {
      return await utils.fetchDataAsJSONNamespace(`${api}/namespaces/rating`, this);
    },
    getCardNamespacesUrl() {
      return `${api}/namespaces`
    },
    getCardPodsUrl() {
      return `${api}/pods`
    },
    getCardNodesUrl() {
      return `${api}/nodes`
    },
    clicked(data) {
      this.selected = data.target.id
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    refreshDate(date) {
      this.dateRange = date;
      utils.refreshDate(date, this)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
        {'endpoint': `${api}/nodes`, 'key': 'node'},
      ], this)
    }
  },
  async beforeMount() {
    await this.generateColor()
  },
  async mounted() {}
}