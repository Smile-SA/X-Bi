<template>
  <!-- Main content -->
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a pod</h4>
        <select class="form-control" v-on:change="getPods">
          <option selected disabled> -- Select a Pod -- </option>
          <option v-for="option in selectForm" v-bind:value="option" v-bind:key="option">{{option}}</option>
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
                <div v-bind:class="'info-box bg-' + card.color">
                  <span class="info-box-icon"><i v-bind:class="'fa fa-' + card.icon"></i></span>
                  <div class="info-box-content" @click="redirect(card)">
                    <div style="text-align: center;">
                      <p></p>
                      <span class="info-box-text">{{card.label}}</span>
                      <span class="info-box-number">{{card.value}}</span>
                    </div>
                  </div>
                </div>
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
                <div v-bind:class="'info-box bg-' + card.color">
                  <span class="info-box-icon"><i v-bind:class="'fa fa-' + card.icon"></i></span>
                  <div class="info-box-content" @click="redirect(card)">
                    <div style="text-align: center;">
                      <p></p>
                      <span class="info-box-text">{{card.label}}</span>
                      <span class="info-box-number">{{card.value}}</span>
                    </div>
                  </div>
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
import * as utils from  '../../public/static/js/utils'
import * as graph from '../../public/static/js/graph'

const api = generateAPIUrl()

export default {
  data () {
    return {
      barChartMetrics: null,
      barChartDataMetrics: null,
      selectForm: null,
      activePod: null,
      cards: [],
      timeCards: [],
      colors: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
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
    redirect(data) {
      utils.redirectCard(data, this)
    },
    getPeriod(url) {
      let broken = url.split('/')
      let l = broken.length
      return '_' + broken[l - 2] + '/' + broken[l - 1]
    },
    getURL(data) {
      let option = data.target.innerText
      let url = this.queryArray[this.selected]
      let filename = this.activePod + '_' + this.selected + this.getPeriod(url) + '.' + option.toLowerCase()
      utils.downloadFile(url, filename, option)
    },
    refreshDate(date) {
      if (date !== null) {
        this.from = date.start.toISOString().split('.')[0] + 'Z'
        if (date.end === null || date.start === date.end) {
          date.end = new Date(this.from)
          date.end.setDate(date.end.getDate() + 1)
        }
        this.to = date.end.toISOString().split('.')[0] + 'Z'
      }
      this.cards = []
      this.timeCards = []
      this.drawCards()
      this.drawGraphs()
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
          title: 'Metrics'
        }
      })
    },
    async drawGraphs() {
      this.drawBarChartMetrics()
    },
    async getPods (pod) {
      let url = `${api}/pods`

      if (pod !== undefined) {
        this.cards = []
        this.activePod = pod.target.value
        this.refreshDate(null)
      }
      let response = await utils.fetchDataAsJSON(url, this)

      this.selectForm = response.results.map(item => item.pod)
    },
    async generateColor() {
      let res = await this.getMetrics()
      res.forEach(item => {
        this.colors[item['metric']] = utils.getRandomColor()
      })
      res = await this.getNamespaces()
      res.forEach(item => {
        this.colors[item['namespace']] = utils.getRandomColor()
      })
      res = await this.getNodes()
      res.forEach(item => {
        this.colors[item['node']] = utils.getRandomColor()
      })
    },
    async getNodes() {
      let url = `${api}/nodes`
      let results = await utils.fetchData(url, this)
      return results
    },
    async cardNamespace() {
      let url = `${api}/pods/${this.activePod}/namespace`
      let response = await utils.fetchDataAsJSON(url, this)
      this.cards.push({
        value: response.results[0].namespace,
        link: '/namespaces',
        label: 'Namespace',
        color: 'purple',
        icon: 'cube'
      })
    },
    async cardNode() {
      let url = `${api}/pods/${this.activePod}/node`
      let response = await utils.fetchDataAsJSON(url, this)
      this.cards.push({
        value: response.results[0].node,
        link: '/nodes',
        label: 'Node',
        color: 'red',
        icon: 'server'
      })
    },
    async cardLifetime() {
      let url = `${api}/pods/${this.activePod}/lifetime`
      let response = await utils.fetchDataAsJSON(url, this)
      let start = response.results[0].start
      let end = response.results[0].end
      this.timeCards.push({
        value: start,
        label: 'Started at',
        link: '/',
        color: 'green',
        icon: 'hourglass-start'
      }, {
        value: end,
        link: '/',
        label: 'Last update',
        color: 'red',
        icon: 'hourglass-end'
      })
    },
    async cardTotalRating() {
      let url = `${api}/pods/${this.activePod}/total_rating`
      let response = await utils.fetchDataAsJSON(url, this)
      this.cards.push({
        value: response.results.map(item => item.frame_price).reduce((a, b) => a + b, 0).toFixed(5),
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'euro-sign'
      })
    },
    async drawCards() {
      await this.cardNamespace()
      await this.cardNode()
      await this.cardTotalRating()
      await this.cardLifetime()
    },
    async getMetrics() {
      let url = `${api}/metrics`
      let results = await utils.fetchData(url, this)
      return results
    },
    async getNamespaces() {
      let url = `${api}/namespaces`
      let results = await utils.fetchData(url, this)
      return results
    }
  },
  async mounted () {
    await this.generateColor()
    this.getPods()
  }
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
