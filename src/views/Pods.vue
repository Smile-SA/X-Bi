<template>
  <!-- Main content -->
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a service</h4>
        <select class="form-control" v-on:change="getPods">
          <option selected disabled> -- Select a service -- </option>
          <option v-for="option in selectPods" v-bind:value="option" v-bind:key="option">{{option}}</option>
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
                <div class="col-sm-12">
                  <p class="text-center">
                    <strong v-if="barChartDataMetrics">{{barChartDataMetrics.title}}</strong>
                  </p>
                  <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="barChartMetrics" height="80%"></canvas>
                </div>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-12" v-for="card in timeCards" v-bind:key="card.label">
                <card :card="card"/>
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
    Card: import('../components/Card')
  },
  data () {
    return {
      barChartMetrics: null,
      barChartDataMetrics: null,
      selectPods: null,
      activePod: null,
      cards: [],
      timeCards: [],
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
    }
  },
  methods: {
    clicked(data) {
      this.selected = data.target.id
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    refreshDate(date) {
      this.timeCards = []
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activePod !== null
    },
    async drawBarChartMetrics() {
      this.barChartMetrics = await graph.drawBarChart({
        url: `${api}/pods/${this.activePod}/rating`,
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          xLabel: 'Time',
          yLabel: 'Rate',
          title: 'Metric rates (in Euros)'
        }
      })
    },
    async drawGraphs() {
      this.drawBarChartMetrics()
    },
    async drawCards() {
      this.cardLifetime()
      await this.cardNamespace()
      await this.cardNode()
      await this.cardTotalRating()
    },
    async cardNamespace() {
      const url = `${api}/pods/${this.activePod}/namespace`
      const response = await utils.fetchDataAsJSON(url, this)
      this.cards.push({
        value: response.results[0].namespace,
        link: '/namespaces',
        label: 'Slice',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16'
      })
    },
    async cardNode() {
      const url = `${api}/pods/${this.activePod}/node`
      const response = await utils.fetchDataAsJSON(url, this)
      this.cards.push({
        value: response.results[0].node,
        link: '/nodes',
        label: 'Node',
        color: 'red',
        icon: 'fa fa-server'
      })
    },
    async cardLifetime() {
      const url = `${api}/pods/${this.activePod}/lifetime`
      const response = await utils.fetchDataAsJSON(url, this)
      const start = response.results[0].start
      const end = response.results[0].end
      this.timeCards.push({
        value: start,
        label: 'Started at',
        link: '/',
        color: 'green',
        icon: 'fa fa-hourglass-start'
      }, {
        value: end,
        link: '/',
        label: 'Last update',
        color: 'red',
        icon: 'fa fa-hourglass-end'
      })
    },
    async cardTotalRating() {
      const url = `${api}/pods/${this.activePod}/total_rating`
      const response = await utils.fetchDataAsJSON(url, this)
      const total = response.results.map(item => item.frame_price).reduce((a, b) => a + b, 0).toFixed(5)
      const from = dateformat(this.from, 'dd/mm/yyyy')
      const to = dateformat(this.to, 'dd/mm/yyyy')
      this.cards.push({
        value: `${total}`,
        link: '/',
        label: 'Rating',
        message: ` from ${from} to ${to}`,
        color: 'yellow',
        icon: 'fa fa-euro-sign'
      })
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
        // ,
        // {'endpoint': `${api}/steps`, 'key': 'step'}
        ], this)
    }
  },
  async beforeMount() {
    await this.generateColor()
    this.selectPods = (await utils.fetchData(`${api}/pods`, this)).map(item => item.pod)
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

.pointer {
  cursor: pointer;
}

.centered-text {
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
}
</style>
