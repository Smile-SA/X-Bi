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
import * as utils from  '../../public/static/js/utils'
import * as graph from '../../public/static/js/graph'

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
    getURL(data) {
      let option = data.target.innerText
      let url = this.queryArray[this.selected]
      let filename = this.selected + utils.getPeriod(url) + '.' + option.toLowerCase()
      utils.downloadFile(url, filename, option)
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
    async drawLineChartNodesRating() {
      this.lineChartNodes = await graph.drawLineChart({
        url: `${api}/nodes/rating`,
        graph: this.lineChartNodes,
        id: 'lineChartNodes',
        sort: 'node',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          yLabel: 'Rate',
          title: 'Nodes'
        }
      })
    },
    async drawLineChartNamespaceRating() {
      this.lineChartNamespaces = await graph.drawLineChart({
        url: `${api}/namespaces/rating`,
        graph: this.lineChartNamespaces,
        id: 'lineChartNamespaces',
        sort: 'namespace',
        context: this,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          yLabel: 'Rate',
          title: 'Namespaces'
        }
      })
    },
    async generateGraphs() {
      this.drawLineChartNodesRating()
      this.drawLineChartNamespaceRating()
    },
    async namespacesCard() {
      let url = `${api}/namespaces`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'cube'
      })
    },
    async nodesCard() {
      let url = `${api}/nodes`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'server'
      })
    },
    async podsCard() {
      let url = `${api}/pods`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
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
    async getNamespaces() {
      let url = `${api}/namespaces`
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
        this.colors[item['namespace']] = utils.getRandomColor()
      })
      res = await this.getNodes()
      res.forEach(item => {
        this.colors[item['node']] = utils.getRandomColor()
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
