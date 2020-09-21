<template>
  <!-- Main content -->
  <section class="content">
  <!-- <meta charset="utf-8"> -->
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a Namespace</h4>
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
            <div v-if='this.activeNamespace !== null'>
              <div>
                <Card :card=confCardNodes></Card>
                <Card :card=confCardPods></Card>
              <!-- <Card :card=confCardTotalRating></Card> -->
              </div>
              <div class="col-sm-6 col-xs-12">
                <bar-chart class="pointer" :configuration=confBarChartMetrics :idL="'barChartMetrics'"  :dataS=this.getMetrics() />
              </div>
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong v-if="pieChartDataNodesPods">{{pieChartDataNodesPods.title}}</strong>
                </p>
                <pie-chart class="pointer" :configuration=confPieChartNodesPods :idL="'pieChartNodesPods'"  :dataS=this.getNodePods() />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- /.content -->
</template>

<script>
import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'

const api = generateAPIUrl()

export default {
  components: {
    BarChart : () => import('../components/charts/BarChart'),
    PieChart : () => import('../components/charts/PieChart'),
    Card : () => import('../components/Card'),
  },
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
      from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
      selected: null,
      queryArray: {}
    }
  },
  computed: {
    isMobile () {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    },
    confBarChartMetrics() {
      return {
        graph: this.barChartMetrics,
        id: 'barChartMetrics',
        sort: 'metric',
        colors: this.colors,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Metrics rate (in Euros)'
        }
      }
    },
    confPieChartNodesPods() {
      return {
        graph: this.pieChartNodesPods,
        id: 'pieChartNodesPods',
        sort: 'node',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Services repartition by nodes'
        }
      }
    },
    confCardNodes() {
      return {
        url: `${api}/namespaces/${this.activeNamespace}/nodes`,
        from: this.from,
        to: this.to,
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'far fa-lightbulb'
      }
    },
    confCardPods() {
      return {
        url: `${api}/namespaces/${this.activeNamespace}/pods`,
        from: this.from,
        to: this.to,
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'far fa-sitemap'
      }
    }
    // ,
    // confCardTotalRating() {
    //   const url = `${api}/namespaces/${this.activeNamespace}/total_rating`
    //   const response = utils.fetchDataAsJSON(url, this)
    //   const from = dateformat(this.from, 'dd/mm/yyyy')
    //   const to = dateformat(this.to, 'dd/mm/yyyy')
    //   let total = 0
    //   if (response.total > 0) {
    //     total = response.results.map(item => item.frame_price)
    //                             .reduce((a, b) => a + b, 0)
    //                             .toFixed(5)
    //   }
    //   return {
    //     value: `${total}`,
    //     link: '/',
    //     label: 'Rating',
    //     message: ` from ${from} to ${to}`,
    //     color: 'yellow',
    //     icon: 'euro-sign'
    //   }
    // }
  },
  methods: {
    clicked(data) {
      this.selected = data.target.id
    },
    async getMetrics() {
      let url = `${api}/namespaces/${this.activeNamespace}/rating`;
      return await utils.fetchDataAsJSON(url, this);
    },
    async getNodePods() {
      let url = `${api}/namespaces/${this.activeNamespace}/nodes/pods`;
      return await utils.fetchDataAsJSON(url, this);
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
    async getNamespaces (namespace) {
      this.cards = []
      this.activeNamespace = namespace.target.value
      this.refreshDate(null)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/metrics`, 'key': 'metric'},
        {'endpoint': `${api}/nodes`, 'key': 'node'}
        ], this)
    },
  },
  async beforeMount() {
    await this.generateColor()
    this.selectForm = (await utils.fetchData(`${api}/namespaces`, this)).map(item => item.namespace)
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
