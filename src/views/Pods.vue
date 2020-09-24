<template>
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a pod</h4>
        <select class="form-control" v-on:change="getPods">
          <option selected disabled> -- Select a pod -- </option>
          <option v-for="option in selectPods" v-bind:value="option" v-bind:key="option">{{option}}</option>
        </select>
      </div>
      <div v-if="showDatePicker()" class="form-group col-xs-2">
        <h4>Select a date</h4>
        <VueRangedatePicker i18n="EN" @selected="refreshDate"></VueRangedatePicker>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title"></h3>
              <div v-if='this.activePod !== null'>
                <Card :configuration=confCardNamespace :url=this.getCardNamespaceUrl()></Card>
                <Card :configuration=confCardNode :url=this.getCardNodeUrl()></Card>
                <Card :configuration=confCardRating :url=this.getCardRatingUrl()></Card>
                <div>
                  <div class="col-sm-12">
                    <BarChart :configuration=confBarChartMetrics :idL="'barChartMetrics'" :dataS=this.getMetrics()></BarChart>
                  </div>
                </div>
                <Card :configuration=confCardStart :url=this.getCardLifetimeUrl()></Card>
                <Card :configuration=confCardEnd :url=this.getCardLifetimeUrl()></Card>
              </div>
            </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'
import dateformat from 'dateformat'

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../components/Card'),
    BarChart: () => import ('../components/charts/BarChart'),
  },
  data () {
    return {
      barChartMetrics: null,
      selectPods: null,
      activePod: null,
      colors: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
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
    confCardNamespace() {
      return {
        from: this.from,
        to: this.to,
        link: '/namespaces',
        label: 'Namespace',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16',
        type: 'string',
        key: 'namespace'
      }
    },
    confCardNode() {
      return {
        from: this.from,
        to: this.to,
        link: '/nodes',
        label: 'Node',
        color: 'red',
        icon: 'fa fa-server',
        type: 'string',
        key: 'node'
      }
    },
    confCardRating() {
      const from = dateformat(this.from, 'dd/mm/yyyy')
      const to = dateformat(this.to, 'dd/mm/yyyy')
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Rating',
        color: 'yellow',
        icon: 'fa fa-euro-sign',
        message: ` from ${from} to ${to}`,
        type: 'sum',
        key: 'frame_price'
      }
    },
    confCardStart() {
      return {
        from: this.from,
        to: this.to,
        label: 'Started at',
        link: '/',
        color: 'green',
        icon: 'fa fa-hourglass-start',
        type: 'string',
        key: 'start'
      }
    },
    confCardEnd() {
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Last update',
        color: 'red',
        icon: 'fa fa-hourglass-end',
        type: 'string',
        key: 'end'
      }
    },
  },
  methods: {
    getURL(data) {
      utils.getURL(data, this)
    },
    getCardNamespaceUrl() {
      return `${api}/pods/${this.activePod}/namespace`
    },
    getCardNodeUrl() {
      return `${api}/pods/${this.activePod}/node`
    },
    getCardRatingUrl() {
      return `${api}/pods/${this.activePod}/total_rating`
    },
    getCardLifetimeUrl() {
      return `${api}/pods/${this.activePod}/lifetime`
    },
    async getMetrics() {
      return await utils.get(`${api}/pods/${this.activePod}/rating`, this)
    },
    refreshDate(date) {
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activePod !== null
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
