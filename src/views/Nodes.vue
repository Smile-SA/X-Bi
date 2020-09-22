<template>
  <!-- Main content -->
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a node</h4>
        <select class="form-control" v-on:change="getNodes">
          <option selected disabled> -- Select a Node -- </option>
          <option v-for="option in selectNodes" v-bind:value="option" v-bind:key="option">{{option}}</option>
        </select>
      </div>
      <div v-if="showDatePicker()" class="form-group col-xs-2">
        <h4>Select a date</h4>
        <VueRangedatePicker i18n="EN" @selected="refreshDate"></VueRangedatePicker>
      </div>
    </div>
    <VueContext ref="menu">
      <ul>
        <li @click="getURL">JSON</li>
        <li @click="getURL">CSV</li>
      </ul>
    </VueContext>
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title"></h3>
              <div v-if='this.activeNode !== null'>
                <Card :configuration=confCardNamespaces :url=this.getCardNamespacesUrl()></Card>
                <Card :configuration=confCardPods :url=this.getCardPodsUrl()></Card>
                <div class="col-sm-6 col-xs-12">
                  <LineChart :configuration=confLineChartNameSpace :idL="'lineChartNamespaces'" :height=150 :dataS=this.nameSpaceData />
                </div>
                <div class="col-sm-6 col-xs-12">
                  <BarChart :configuration=confBarChartMetrics :idL="'barChartMetrics'"  :dataS=this.getMetrics() />
                </div>
              </div>
            </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
    <!-- /.row -->
  </section>
  <!-- /.content -->
</template>

<script>
import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../components/Card'),
    LineChart: () => import ('../components/charts/LineChart'),
    BarChart: () => import ('../components/charts/BarChart'),
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
      if (!api || !this.activeNode) {
        return;
      }
      const c = {
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

      return c;
    },
    confCardNamespaces() {
      return {
        from: this.from,
        to: this.to,
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16'
      }
    },
    confCardPods() {
      return {
        from: this.from,
        to: this.to,
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'fab fa-cloudversify'
      }
    },
    nameSpaceData() {
      return this.getNamespaces();
    }
  },
  methods: {
    getURL(data) {
      utils.getURL(data, this)
    },
    getCardNamespacesUrl() {
      return `${api}/nodes/${this.activeNode}/namespaces`
    },
    getCardPodsUrl() {
      return `${api}/nodes/${this.activeNode}/pods`
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
    // async cardTotalRating() {
    //   const url = `${api}/nodes/${this.activeNode}/total_rating`
    //   const response = await utils.fetchDataAsJSON(url, this)
    //   const from = dateformat(this.from, 'dd/mm/yyyy')
    //   const to = dateformat(this.to, 'dd/mm/yyyy')
    //   let total = 0
    //   if (response.total > 0) {
    //     total = response.results.map(item => item.frame_price).reduce((a, b) => a + b, 0)
    //   }
    //   this.cards.push({
    //     value: `${total.toFixed(5)}`,
    //     link: '/',
    //     label: 'Rating',
    //     message: ` from ${from} to ${to}`,
    //     color: 'yellow',
    //     icon: 'fa fa-euro-sign'
    //   })
    // },
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
</script>

<style>
.info-box {
  cursor: pointer;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
.fullCanvas {
  width: 100%;
}
</style>
