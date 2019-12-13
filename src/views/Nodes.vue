<template>
  <!-- Main content -->
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a node</h4>
        <select class="form-control" v-on:change="getNodes">
          <option selected disabled> -- Select a Node -- </option>
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
                  <span class="info-box-icon"><svg v-bind:class="'' + card.icon"></svg></span>
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
                <div class="col-sm-6 col-xs-12">
                  <p class="text-center">
                    <strong v-if="lineChartDataNamespaces">{{lineChartDataNamespaces.title}}</strong>
                  </p>
                  <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartNamespaces"></canvas>
                </div>
                <div class="col-sm-6 col-xs-12">
                  <p class="text-center">
                    <strong v-if="barChartDataMetrics">{{barChartDataMetrics.title}}</strong>
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

const api = generateAPIUrl()

export default {
  data () {
    return {
      lineChartNamespaces: null,
      lineChartDataNamespaces: null,
      barChartMetrics: null,
      barChartDataMetrics: null,
      selectForm: null,
      activeNode: null,
      cards: [],
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
    clicked(data) {
      this.selected = data.target.id
    },
    redirect(data) {
      utils.redirectCard(data, this)
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    refreshDate(date) {
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async drawLineChartNamespaces() {
      this.lineChartNamespaces = await graph.drawLineChart({
        url: `${api}/nodes/${this.activeNode}/namespaces/rating`,
        graph: this.lineChartNamespaces,
        id: 'lineChartNamespaces',
        sort: 'namespace',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          yLabel: 'Rate',
          title: 'Slices'
        }
      })
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
          yLabel: 'Rate',
          title: 'Metrics'
        }
      })
    },
    async drawGraphs() {
      this.drawBarChartMetrics()
      this.drawLineChartNamespaces()
    },
    async drawCards() {
      this.cardNamespaces()
      this.cardPods()
      this.cardTotalRating()
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
      let total = 0
      if (response.total > 0) {
        total = response.results.map(item => item.frame_price).reduce((a, b) => a + b, 0)
      }
      this.cards.push({
        value: total.toFixed(5),
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'fa fa-euro-sign'
      })
    },
    async getNodes (node) {
      const url = `${api}/nodes`

      if (node !== undefined) {
        this.cards = []
        this.activeNode = node.target.value
        this.refreshDate(null)
      }
      const results = await utils.fetchData(url, this)
      this.selectForm = results.map(item => item.node)
    },
    async generateColor() {
      await (await utils.fetchData(`${api}/namespaces`, this))
      .forEach(item => this.colors[item['namespace']] = utils.getRandomColor())
      await (await utils.fetchData(`${api}/metrics`, this))
      .forEach(item => this.colors[item['metric']] = utils.getRandomColor())
    },
  },
  async mounted () {
    await this.generateColor()
    this.getNodes()
  }
}
</script>

<style>
.slice-icon {
  background-image: url('../../public/static/img/5GBiller_-__Slices_-_logo_-_whiteV2.svg');
  background-repeat: no-repeat;
  border-top-left-radius: 2px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 2px;
  width: 45px;
  font-size: 45px;
  text-align: center;
}

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
