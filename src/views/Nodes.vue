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

const api = `${window.location.href.split('#')[0]}/api`

export default {
  data () {
    return {
      lineChartNamespaces: null,
      lineChartDataNamespaces: null,
      lineChartMetrics: null,
      lineChartDataMetrics: null,
      barChartMetrics: null,
      barChartDataMetrics: null,
      selectForm: null,
      activeNode: null,
      pieChartPodCost: null,
      pieChartDataPodCost: null,
      cards: [],
      loading: true,
      errored: false,
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
    convertURLDateParameter() {
      let from = (this.from !== null) ? this.from : new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
      let to = (this.to !== null) ? this.to : new Date().toISOString()
      from = from.replace('T', ' ')
      to = to.replace('T', ' ')
      return `?start=${from}&end=${to}`
    },
    clicked(data) {
      this.selected = data.target.id
    },
    JSONToCSV(json) {
      const replacer = (key, value) => value === null ? '' : value
      const header = Object.keys(json[0])
      let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      csv.unshift(header.join(','))
      return csv.join('\r\n')
    },
    async downloadFile(url, filename, type) {
      let results = await this.fetchResults(url)
      let content
      let mime
      if (type === 'JSON') {
        content = await JSON.stringify(results)
        mime = 'application/json'
      } else if (type === 'CSV') {
        content = this.JSONToCSV(results)
        mime = 'text/csv'
      }
      require('downloadjs')(content, filename, mime)
    },
    getPeriod(url) {
      let broken = url.split('/')
      let l = broken.length
      return '_' + broken[l - 2] + '/' + broken[l - 1]
    },
    getURL(data) {
      let option = data.target.innerText
      let url = this.queryArray[this.selected]
      let filename = this.activeNode + '_' + this.selected + this.getPeriod(url) + '.' + option.toLowerCase()
      this.downloadFile(url, filename, option)
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
    redirectCard(data) {
      if (data.link !== '/') {
        this.$router.push(data.link)
      }
    },
    getRandomColor () {
      var chartColors = [
        '#001f3f',
        '#10375E',
        '#173A5E',
        '#173D5E',
        '#164F87',
        '#32415c',
        '#2C3C5B',
        '#4D6087',
        '#324C63',
        '#4F6B84',
        '#3b898d',
        '#377275',
        '#2E5B50',
        '#265149',
        '#538389',
        '#2D5459',
        '#4b93b0',
        '#66A0B7',
        '#385C6B',
        '#1C4D60',
        '#1F4B6B',
        '#1F6B5E',
        '#d2d6de',
        '#b5bbc8',
        '#a70446',
        '#7C123D',
        '#960A42',
        '#77143C',
        '#771458',
        '#771914',
        '#701611',
        '#511714',
        '#93231D',
        '#6D1A42',
        '#490B29',
        '#842D57',
        '#84512D',
        '#7F441A',
        '#a83d48',
        '#8E3039',
        '#842932',
        '#601F26',
        '#CC7B41',
        '#9E511A',
        '#9E351A',
        '#c26929'
      ]

      return chartColors[Math.floor(Math.random() * chartColors.length)]
    },
    groupBy(objectArray, property) {
      return objectArray.reduce(function (acc, obj) {
        let key = obj[property]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {})
    },
    where(collection, constraint) {
      return collection.filter(collectionItem =>
        Object.keys(constraint).every(key =>
         collectionItem.hasOwnProperty(key) && constraint[key] === collectionItem[key]))
    },
    async fetchDataAsJSON(url) {
      let queryDate = this.convertURLDateParameter()

      url = url + queryDate
      const response = await fetch(url, {})
      const json = await response.json()
      if (json.total === 0) {
        return {total: 0, results: null}
      }
      return {total: json.total, results: json.results}
    },
    generateGraph(response, sort, element, c) {
      let graph = []
      let dataset = this.groupBy(response, sort)
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

      let {total, results} = await this.fetchDataAsJSON(c.url)
      if (total === 0) {
        return null
      }

      let queryDate = this.convertURLDateParameter()

      let ctx = document.getElementById(c.id).getContext('2d')

      let graph = []
      let dataset = this.groupBy(results, c.sort)
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
      let {total, results} = await this.fetchDataAsJSON(c.url)
      if (total === 0) {
        return null
      }
      let {ctx, config} = await this.generateGraph(results, c.sort, c.id, c.labels)
      let queryDate = this.convertURLDateParameter()
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
    async drawHorizontalBarChart(c) {
      let data = {
        datasets: [],
        labels: []
      }

      if (c.graph !== null) {
        c.graph.destroy()
      }

      let {total, results} = await this.fetchDataAsJSON(c.url)
      if (total === 0) {
        return null
      }

      Object.keys(this.groupBy(results, c.sort)).forEach(type => {
        let values = this.where(results, {[c.sort]: type}).map(value => value[c.unit])
        let color = (c.color !== null) ? c.color : this.colors[type]
        data.datasets.push({
          label: type,
          data: values,
          backgroundColor: color,
          borderWidth: 0.7
        })
      })

      data.labels = Object.keys(this.groupBy(results, 'service'))

      let ctx = document.getElementById(c.id).getContext('2d')
      let config = {
        type: 'horizontalBar',
        data: {
          datasets: data.datasets,
          labels: data.labels
        },
        options: {
          title: {
            display: true,
            text: c.labels.title
          },
          scales: {
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true
              }
            }],
            yAxes: [{
              stacked: true,
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
            position: 'top',
            display: true
          },
          tooltips: {
            intersect: false,
            mode: 'label'
          }
        }
      }
      return new Chart(ctx, config)
    },
    async getNodes (node) {
      let url = `${api}/nodes`

      if (node !== undefined) {
        this.cards = []
        this.activeNode = node.target.value
        this.refreshDate(null)
      }

      let results = await this.fetchResults(url)

      this.selectForm = results.map(item => item.node)
    },
    async generateColor() {
      let res = await this.getMetrics()
      res.forEach(item => {
        this.colors[item['metric']] = this.getRandomColor()
      })
      res = await this.getNamespaces()
      res.forEach(item => {
        this.colors[item['namespace']] = this.getRandomColor()
      })
    },
    async cardPods() {
      let url = `${api}/nodes/${this.activeNode}/pods`
      this.cards.push({
        value: await this.fetchTotal(url),
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'boxes'
      })
    },
    async cardNamespaces() {
      let url = `${api}/nodes/${this.activeNode}/namespaces`
      this.cards.push({
        value: await this.fetchTotal(url),
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'cube'
      })
    },
    async fetchTotal(url) {
      let queryDate = this.convertURLDateParameter()
      url = url + queryDate
      const response = await fetch(url, {})
      const json = await response.json()
      return json.total
    },
    async cardTotalRating() {
      let url = `${api}/nodes/${this.activeNode}/total_rating`
      let response = await this.fetchDataAsJSON(url)
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
      let results = await this.fetchResults(url)
      return results
    },
    async getNamespaces() {
      let url = `${api}/namespaces`
      let results = await this.fetchResults(url)
      return results
    },
    async fetchResults(url) {
      const response = await fetch(url, {})
      const json = await response.json()
      return json.results
    }
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
