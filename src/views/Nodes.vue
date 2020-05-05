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
              <div class="col-md-4 col-sm-6 col-xs-12" v-for="card in cards" v-bind:key="card.label">
                <card :card="card"/>
              </div>
              <div>
                <div class="col-sm-6 col-xs-12">
                  <p class="text-center">
                    <strong v-if="lineChartNamespaces">{{lineChartNamespaces.title}}</strong>
                  </p>
                  <line-chart class="pointer" :configuration=confLineChartNameSpace :idL="'lineChartNamespaces'" :height=150 :dataS=this.nameSpaceData />
                </div>
                <div class="col-sm-6 col-xs-12">
                  <p class="text-center">
                    <strong v-if="barChartMetrics">{{barChartMetrics.title}}</strong>
                  </p>
                  <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="barChartMetrics"></canvas>
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
import * as graph from '../graph'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
  components: {
    Card: import('../components/Card'),
    LineChart: () => import ('../components/charts/LineChart')
  },
  data () {
    return {
      dateRange: null,
      lineChartNamespaces: null,
      barChartMetrics: null,
      selectNodes: null,
      activeNode: null,
      cards: [],
      colors: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      selected: null,
      queryArray: {}
    }
  },
  computed: {
    isMobile () {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
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
    nameSpaceData() {
      return this.getNamespaces();
    }
  },
  methods: {
    clicked(data) {
      this.selected = data.target.id
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    async getNamespaces() {
      if (!this.activeNode) {
        return {total: 0, results: []}
      }
      let url = `${api}/nodes/${this.activeNode}/namespaces/rating`;
      return await utils.fetchDataAsJSON(url, this);
    },
    refreshDate(date) {
      if (date) {
        this.dateRange = date;
      }
      utils.refreshDate(date, this)
      this.drawGraphs()
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async drawBarChartMetrics() {
      this.barChartMetrics = await graph.drawBarChart({
        url: `${api}/nodes/${this.activeNode}/rating`,
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Metrics rates (in Euros)'
        }
      })
    },
    async drawGraphs() {
      this.drawBarChartMetrics()
    },
    async drawCards() {
      await this.cardNamespaces()
      await this.cardPods()
      await this.cardTotalRating()
    },
    async cardPods() {
      const url = `${api}/nodes/${this.activeNode}/pods`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/pods',
        label: 'Services',
        color: 'blue',
        icon: 'fa fa-sitemap'
      })
    },
    async cardNamespaces() {
      const url = `${api}/nodes/${this.activeNode}/namespaces`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/namespaces',
        label: 'Slices',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16'
      })
    },
    async cardLabels() {
      const url = `${api}/nodes/${this.activeNode}/labels`
      this.cards.push({
        value: await utils.fetchDataAsJSON(url, this),
        link: '/',
        label: 'Labels',
        color: 'green',
        icon: ''
      })
    },
    async cardTotalRating() {
      const url = `${api}/nodes/${this.activeNode}/total_rating`
      const response = await utils.fetchDataAsJSON(url, this)
      const from = dateformat(this.from, 'dd/mm/yyyy')
      const to = dateformat(this.to, 'dd/mm/yyyy')
      let total = 0
      if (response.total > 0) {
        total = response.results.map(item => item.frame_price).reduce((a, b) => a + b, 0)
      }
      this.cards.push({
        value: `${total.toFixed(5)}`,
        link: '/',
        label: 'Rating',
        message: ` from ${from} to ${to}`,
        color: 'yellow',
        icon: 'fa fa-euro-sign'
      })
    },
    async getNodes (node) {
      this.cards = []
      this.activeNode = node.target.value
      this.refreshDate(null)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
        {'endpoint': `${api}/metrics`, 'key': 'metric'}
        // {'endpoint': `${api}/steps`, 'key': 'step'}
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
