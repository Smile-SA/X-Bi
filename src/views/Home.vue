<template>
  <!-- Main content -->
  <section class="content">
    <div id="app" class="form-group col-xs-2">
      <h4>Select a date</h4>
      <VueRangedatePicker  id="rangeDatePicker" v-model="date" i18n="EN" @selected="getDate"/>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header">
            <div class="row">
            <h3 class="box-title"></h3>
              <div class="col-md-4 col-sm-6 col-xs-12 column" v-for="card in cards" v-bind:key="card.label">
                <div v-bind:class="'info-box bg-' + card.color">
                  <span class="info-box-icon"><i v-bind:class="'fa fa-' + card.icon"></i></span>

                  <div class="info-box-content" @click="redirectCard(card)">
                    <div style="text-align: center;">
                      <p></p>
                      <span class="info-box-text">{{card.label}}</span>
                      <span class="info-box-number">{{card.value}}</span>
                    </div>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              </div>

              <!-- For each hosts -->
              <div>
                <div>
                  <VueContext ref="menu">
                    <ul>
                      <li @click="getURL">JSON</li>
                      <li @click="getURL">CSV</li>
                    </ul>
                  </VueContext>
                  <div class="col-sm-12">
                    <p class="text-center">
                      <strong v-if="lineChartDataNodes">{{lineChartDataNodes.title}}</strong>
                    </p>
                    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartNodes" height="80%"></canvas>
                  </div>
                  <div class="col-sm-12">
                    <p class="text-center">
                      <strong v-if="lineChartDataNamespaces">{{lineChartDataNamespaces.title}}</strong>
                    </p>
                    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartNamespaces" height="80%"></canvas>
                  </div>

                </div>
              </div>

              <!-- <hr class="visible-xs-block"> -->

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /.row -->

    <!-- Main row -->
    <!-- /.row -->
  </section>
  <!-- /.content -->
</template>
<script>

import Chart from 'chart.js'
import { generateAPIUrl } from '../variables'

const api = generateAPIUrl()

export default {
  data() {
    return {
      date: null,
      lineChartNodes: null,
      lineChartDataNodes: null,
      lineChartNamespaces: null,
      lineChartDataNamespaces: null,
      colors: {},
      cards: [],
      loading: true,
      errored: false,
      hostNumbers: 0,
      to: new Date().toISOString(),
      from: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      selected: null,
      queryArray: {}
    }
  },
  computed: {
    isMobile() {
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
      csv = csv.join('\r\n')
      return csv
    },
    async downloadFile(url, filename, type) {
      const response = await fetch(url, {})
      const json = await response.json()
      let content
      let mime
      if (type === 'JSON') {
        content = await JSON.stringify(json.results)
        mime = 'application/json'
      } else if (type === 'CSV') {
        content = this.JSONToCSV(json.results)
        mime = 'text/csv'
      }
      require('downloadjs')(content, filename, mime)
    },
    getPeriod(url) {
      let broken = url.split('?')[1].split('&')
      let from = broken[0].split('=')[1]
      let to = broken[1].split('=')[1]
      return `_${from}-${to}`
    },
    getURL(data) {
      let option = data.target.innerText
      let url = this.queryArray[this.selected]
      let filename = this.selected + this.getPeriod(url) + '.' + option.toLowerCase()
      this.downloadFile(url, filename, option)
    },
    getDate(date) {
      this.from = date.start.toISOString().split('.')[0] + 'Z'
      if (date.end === null || date.start === date.end) {
        date.end = new Date(this.from)
        date.end.setDate(date.end.getDate() + 1)
      }
      this.to = date.end.toISOString().split('.')[0] + 'Z'
      this.cards = []
      this.drawCards()
      this.generateGraphs()
    },
    getRandomColor() {
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
      return objectArray.reduce(function(acc, obj) {
        let key = obj[property]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {})
    },
    redirectCard(data) {
      if (data.link !== '/') {
        this.$router.push(data.link)
      }
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
              display: true,
              scaleLabel: {
                display: true
              }
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
    async drawLineChartNodesRating() {
      this.lineChartNodes = await this.drawLineChart({
        url: `${api}/nodes/rating`,
        graph: this.lineChartNodes,
        id: 'lineChartNodes',
        sort: 'node',
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          yLabel: 'Rate',
          title: 'Nodes'
        }
      })
    },
    async drawLineChartNamespaceRating() {
      this.lineChartNamespaces = await this.drawLineChart({
        url: `${api}/namespaces/rating`,
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
    async fetchTotal(url) {
      let queryDate = this.convertURLDateParameter()
      url = url + queryDate
      const response = await fetch(url, {})
      const json = await response.json()
      return json.total
    },
    async fetchData(url) {
      let queryDate = this.convertURLDateParameter()
      url = url + queryDate
      const response = await fetch(url, {})
      const json = await response.json()
      return json.results
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
    async drawLineChart(c) {
      if (c.graph !== null) {
        c.graph.destroy()
      }
      let {total, results} = await this.fetchDataAsJSON(c.url)
      if (total === 0) {
        return c.graph
      }
      let {ctx, config} = await this.generateGraph(results, c.sort, c.id, c.labels)
      let queryDate = this.convertURLDateParameter()
      this.queryArray[c.id] = `${c.url}${queryDate}`
      return new Chart(ctx, config)
    },
    async drawBarChart(labels, url, element) {
      let {total, results} = await this.fetchDataAsJSON(url) // eslint-disable-line
      let datasets = []

      labels = [labels]
      results.forEach(item => {
        datasets.push({
          label: item.service,
          data: [item.price.toFixed(5)],
          backgroundColor: this.getRandomColor()
        })
      })

      let ctx = document.getElementById(element).getContext('2d')
      let config = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          animation: false,
          legend: {
            display: false
          },
          title: {
            display: true
          },
          scales: {
            xAxes: [{
              stacked: true,
              barThickness: 70
            }],
            yAxes: [{
              stacked: true,
              scaleLabel: {
                display: true
              }
            }]
          }
        }
      }
      this.queryArray[element] = url
      return {ctx, config}
    },
    async generateGraphs() {
      this.drawLineChartNodesRating()
      this.drawLineChartNamespaceRating()
    },
    async namespacesCard() {
      let url = `${api}/namespaces`
      this.cards.push({
        value: await this.fetchTotal(url),
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'cube'
      })
    },
    async nodesCard() {
      let url = `${api}/nodes`
      this.cards.push({
        value: await this.fetchTotal(url),
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'server'
      })
    },
    async podsCard() {
      let url = `${api}/pods`
      this.cards.push({
        value: await this.fetchTotal(url),
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'boxes'
      })
    },
    async drawCards() {
      this.namespacesCard()
      this.nodesCard()
      this.podsCard()
    },
    async getTotal(url) {
      let results = await fetch(url)
      let json = await results.json()
      return json.total
    },
    async getNamespaces() {
      let url = `${api}/namespaces`
      console.log(url)
      let results = await fetch(url)
      let json = await results.json()
      return json.results
    },
    async getNodes() {
      let url = `${api}/nodes`
      let results = await fetch(url)
      let json = await results.json()
      return json.results
    },
    async generateColorSet() {
      let res = await this.getNamespaces()
      res.forEach(item => {
        this.colors[item['namespace']] = this.getRandomColor()
      })
      res = await this.getNodes()
      res.forEach(item => {
        this.colors[item['node']] = this.getRandomColor()
      })
    }
  },
  async mounted() {
    await this.generateColorSet()
    this.drawCards()
    this.generateGraphs()
  }
}
</script>

<style>
.info-box {
  cursor: pointer;
}
.column {
  float: left;
  width: 25%;
  padding: 0 10px;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
.fullCanvas {
  width: 100%;
}

.card {
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  text-align: center;
  position: relative;
}

.card-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

.card-1:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 3px 3px rgba(0,0,0,0.22);
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
