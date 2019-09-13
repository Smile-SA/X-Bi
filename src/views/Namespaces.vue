<template>
  <!-- Main content -->
  <section class="content">
  <!-- <meta charset="utf-8"> -->
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a namespace</h4>
        <select class="form-control" v-on:change="getNamespaces">
          <option selected disabled> -- Select a Namespace -- </option>
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
                  <div style="text-align: center;" class="info-box-content" @click="redirectCard(card)">
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
import Chart from 'chart.js'
import { generateAPIUrl } from '../variables'
import * as utils from  '../../public/static/js/utils'

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
    getPeriod(url) {
      let broken = url.split('/')
      let l = broken.length
      return '_' + broken[l - 2] + '/' + broken[l - 1]
    },
    getURL(data) {
      let option = data.target.innerText
      let url = this.queryArray[this.selected]
      let filename = this.activeNamespace + '_' + this.selected + this.getPeriod(url) + '.' + option.toLowerCase()
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
      this.drawCards()
      this.drawGraphs()
    },
    showDatePicker() {
      return this.activeNamespace !== null
    },
    async drawPieNodesPods() {
      this.pieChartNodesPods = await this.drawPieChart({
        url: `${api}/namespaces/${this.activeNamespace}/nodes/pods`,
        graph: this.pieChartNodesPods,
        id: 'pieChartNodesPods',
        sort: 'node',
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Pods repartition'
        }
      })
    },
    async drawPieChart(c) {
      if (c.graph !== null) {
        c.graph.destroy()
      }

      let {total, results} = await utils.fetchDataAsJSON(c.url, this)
      if (total === 0) {
        return c.graph
      }

      let queryDate = utils.convertURLDateParameter(this.from, this.to)

      let dataset = utils.groupBy(results, c.sort)
      let labels = [...Object.keys(dataset)]
      let colors = [...Object.keys(dataset)].map((item) => this.colors[item])
      dataset = [...Object.values(dataset)].map((item) => item.length)

      let ctx = document.getElementById(c.id).getContext('2d')
      let config = {
        type: 'doughnut',
        data: {
          datasets: [{
            data: dataset,
            backgroundColor: colors
          }],
          labels: labels
        },
        options: {
          title: {
            display: true,
            text: c.labels.title
          },
          responsive: true,
          maintainAspectRatio: !this.isMobile,
          legend: {
            display: false
          },
          tooltips: {
            intersect: false,
            mode: 'label'
          }
        }
      }
      this.queryArray[c.id] = `${c.url}${queryDate}`
      return new Chart(ctx, config)
    },
    async drawBarChart(c) {
      if (c.graph !== null) {
        c.graph.destroy()
      }

      let {total, results} = await utils.fetchDataAsJSON(c.url, this)
      if (total === 0) {
        return c.graph
      }

      let queryDate = utils.convertURLDateParameter(this.from, this.to)
      let ctx = document.getElementById(c.id).getContext('2d')

      let graph = []
      let dataset = utils.groupBy(results, c.sort)
      let labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

      labels.forEach((item, count) => {
        labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'})
      })

      Object.keys(dataset).forEach(item => {
        let obj = []
        let color = this.colors[item]
        Object.values(dataset[item]).forEach(subItem => {
          obj.push(subItem[c.labels.value].toFixed(5))
        })
        graph.push({
          label: item,
          fill: true,
          backgroundColor: color,
          data: obj
        })
      })
      let config = {
        type: 'bar',
        data: {
          datasets: graph,
          labels: labels
        },
        options: {
          title: {
            display: true,
            text: c.labels.title
          },
          scales: {
            xAxes: [{
              ticks: {
                maxTicksLimit: 10
              },
              display: true,
              scaleLabel: {
                display: true
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: c.labels.yLabel
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: !this.isMobile,
          legend: {
            display: false
          },
          tooltips: {
            intersect: false,
            mode: 'label'
          }
        }
      }
      this.queryArray[c.id] = `${c.url}${queryDate}`
      return new Chart(ctx, config)
    },
    async drawBarChartMetrics() {
      this.barChartMetrics = await this.drawBarChart({
        url: `${api}/namespaces/${this.activeNamespace}/rating`,
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
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
      this.drawPieNodesPods()
    },
    async getNamespaces (namespace) {
      let url = `${api}/namespaces`

      if (namespace !== undefined) {
        this.cards = []
        this.activeNamespace = namespace.target.value
        this.refreshDate(null)
      }

      let results = await utils.fetchData(url, this)

      this.selectForm = results.map(item => item.namespace)
    },
    async generateColor() {
      let res = await this.getMetrics()
      res.forEach(item => {
        this.colors[item['metric']] = utils.getRandomColor()
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
    async cardPods() {
      let url = `${api}/namespaces/${this.activeNamespace}/pods`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'boxes'
      })
    },
    async cardNodes() {
      let url = `${api}/namespaces/${this.activeNamespace}/nodes`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'server'
      })
    },
    async fetchTotal(url) {
      let queryDate = utils.convertURLDateParameter(this.from, this.to)
      url = url + queryDate
      const response = await fetch(url, {})
      const json = await response.json()
      return json.total
    },
    async cardTotalRating() {
      let url = `${api}/namespaces/${this.activeNamespace}/total_rating`
      let response = await utils.fetchDataAsJSON(url, this)
      let total = 0
      if (response.total > 0) {
        total = response.results.map(item => item.frame_price)
                                .reduce((a, b) => a + b, 0)
                                .toFixed(5)
      }
      this.cards.push({
        value: total,
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'euro-sign'
      })
    },
    async drawCards() {
      this.cardNodes()
      this.cardPods()
      this.cardTotalRating()
    },
    async getMetrics() {
      let url = `${api}/metrics`
      const response = await fetch(url, {})
      const json = await response.json()
      return json.results
    }
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
