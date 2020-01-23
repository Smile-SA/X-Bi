<template>
  <!-- Main content -->
  <section class="content">
  <!-- <meta charset="utf-8"> -->
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a slice</h4>
        <select class="form-control" v-on:change="getNamespaces">
          <option selected disabled> -- Select a Slice -- </option>
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
                  <div style="text-align: center;" class="info-box-content" @click="redirect(card)">
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
                    <strong v-if="barChartDataMetrics">{{barChartDataMetrics.title}}</strong>
                  </p>
                  <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="barChartMetrics"></canvas>
                </div>
                <div class="col-sm-6 col-xs-12">
                  <p class="text-center">
                    <strong v-if="pieChartDataNodesPods">{{pieChartDataNodesPods.title}}</strong>
                  </p>
                  <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="pieChartNodesPods"></canvas>
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
  data () {
    return {
      barChartMetrics: null,
      barChartDataMetrics: null,
      pieChartNodesPods: null,
      pieChartDataNodesPods: null,
      selectForm: null,
      activeNamespace: null,
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
      return this.activeNamespace !== null
    },
    async drawPieNodesPods() {
      this.pieChartNodesPods = await graph.drawPieChart({
        url: `${api}/namespaces/${this.activeNamespace}/nodes/pods`,
        graph: this.pieChartNodesPods,
        id: 'pieChartNodesPods',
        sort: 'node',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Services repartition by nodes'
        }
      })
    },
    async drawBarChartMetrics() {
      this.barChartMetrics = await graph.drawBarChart({
        url: `${api}/namespaces/${this.activeNamespace}/rating`,
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Metrics rate (in Euros)'
        }
      })
    },
    async drawGraphs() {
      this.drawBarChartMetrics()
      this.drawPieNodesPods()
    },
    async drawCards() {
      await this.cardNodes()
      await this.cardPods()
      await this.cardTotalRating()
    },
    async cardPods() {
      const url = `${api}/namespaces/${this.activeNamespace}/pods`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/pods',
        label: 'Services',
        color: 'blue',
        icon: 'sitemap'
      })
    },
    async cardNodes() {
      const url = `${api}/namespaces/${this.activeNamespace}/nodes`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'server'
      })
    },
    async cardTotalRating() {
      const url = `${api}/namespaces/${this.activeNamespace}/total_rating`
      const response = await utils.fetchDataAsJSON(url, this)
      const from = dateformat(this.from, 'dd/mm/yyyy')
      const to = dateformat(this.to, 'dd/mm/yyyy')
      let total = 0
      if (response.total > 0) {
        total = response.results.map(item => item.frame_price)
                                .reduce((a, b) => a + b, 0)
                                .toFixed(5)
      }
      this.cards.push({
        value: `${total} from ${from} to ${to}`,
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'euro-sign'
      })
    },
    async getNamespaces (namespace) {
      const url = `${api}/namespaces`

      if (namespace !== undefined) {
        this.cards = []
        this.activeNamespace = namespace.target.value
        this.refreshDate(null)
      }
      const results = await utils.fetchData(url, this)
      this.selectForm = results.map(item => item.namespace)
    },
    async generateColor() {
      await (await utils.fetchData(`${api}/metrics`, this))
      .forEach(item => this.colors[item['metric']] = utils.getRandomColor())
      await (await utils.fetchData(`${api}/nodes`, this))
      .forEach(item => this.colors[item['node']] = utils.getRandomColor())
    },
  },
  async mounted () {
    await this.generateColor()
    this.getNamespaces()
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
