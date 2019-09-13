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
                  <span class="info-box-icon"><i v-bind:class="'fa fa-' + card.icon"></i></span>
                  <div class="info-box-content" @click="redirectCard(card)">
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
import Chart from 'chart.js'
import { generateAPIUrl } from '../variables'
import * as utils from  '../../public/static/js/utils'

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
    getURL(data) {
      let option = data.target.innerText
      let url = this.queryArray[this.selected]
      let filename = this.activeNode + '_' + this.selected + this.getPeriod(url) + '.' + option.toLowerCase()
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
    generateGraph(response, sort, element, c) {
      let graph = []
      let dataset = utils.groupBy(response, sort)
      let labels = dataset[Object.keys(dataset)[0]].map(item => item[c.time])

      labels.forEach((item, count) => {
        labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'})
      })

      Object.keys(dataset).forEach(item => {
        let obj = []
        let color = this.colors[item]
        Object.values(dataset[item]).forEach(subItem => {
          obj.push(subItem[c.value].toFixed(5))
        })
        graph.push({
          label: item,
          fill: true,
          borderColor: color,
          pointBackgroundColor: color,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          data: obj
        })
      })

      var ctx = document.getElementById(element).getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: labels,
          datasets: graph
        },
        options: {
          animation: false,
          scales: {
            xAxes: [{
              ticks: {
                maxTicksLimit: 10
              },
              display: true
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: c.yLabel
              }
            }]
          },
          title: {
            display: true,
            text: c.title
          },
          maintainAspectRatio: !this.isMobile,
          legend: {
            position: 'top',
            display: true
          },
          tooltips: {
            intersect: false,
            mode: 'label'
          }
        }
      }
      return {ctx: ctx, config: config} // eslint-disable-line no-new
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async drawBarChart(c) {
      if (c.graph !== null) {
        c.graph.destroy()
      }

      let {total, results} = await utils.fetchDataAsJSON(c.url, this)
      if (total === 0) {
        return null
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
    async drawLineChart(c) {
      if (c.graph !== null) {
        c.graph.destroy()
      }
      let {total, results} = await utils.fetchDataAsJSON(c.url, this)
      if (total === 0) {
        return null
      }
      let {ctx, config} = await this.generateGraph(results, c.sort, c.id, c.labels)
      let queryDate = utils.convertURLDateParameter(this.from, this.to)
      this.queryArray[c.id] = `${c.url}${queryDate}`
      return new Chart(ctx, config)
    },
    async drawLineChartNamespaces() {
      this.lineChartNamespaces = await this.drawLineChart({
        url: `${api}/nodes/${this.activeNode}/namespaces/rating`,
        graph: this.lineChartNamespaces,
        id: 'lineChartNamespaces',
        sort: 'namespace',
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          yLabel: 'Rate',
          title: 'Namespaces'
        }
      })
    },
    async drawBarChartMetrics() {
      this.barChartMetrics = await this.drawBarChart({
        url: `${api}/nodes/${this.activeNode}/rating`,
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
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
    async getNodes (node) {
      let url = `${api}/nodes`

      if (node !== undefined) {
        this.cards = []
        this.activeNode = node.target.value
        this.refreshDate(null)
      }

      let results = await utils.fetchData(url, this)

      this.selectForm = results.map(item => item.node)
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
    },
    async cardPods() {
      let url = `${api}/nodes/${this.activeNode}/pods`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'boxes'
      })
    },
    async cardNamespaces() {
      let url = `${api}/nodes/${this.activeNode}/namespaces`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'cube'
      })
    },
    async cardTotalRating() {
      let url = `${api}/nodes/${this.activeNode}/total_rating`
      let response = await utils.fetchDataAsJSON(url, this)
      let total = 0
      if (response.total > 0) {
        total = response.results.map(item => item.frame_price).reduce((a, b) => a + b, 0)
      }
      this.cards.push({
        value: total.toFixed(5),
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'euro-sign'
      })
    },
    async drawCards() {
      await this.cardNamespaces()
      await this.cardPods()
      await this.cardTotalRating()
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
    },
  },
  async mounted () {
    await this.generateColor()
    this.getNodes()
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
</style>
