<template>
  <!-- Main content -->
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a node</h4>
        <select class="form-control" v-on:change="getNodes">
          <option selected disabled> -- Select a Node -- </option>
          <option v-for="option in selectNodes" v-bind:value="option" v-bind:key="option">{{option}}</option>
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
              <div v-if='this.activeNode !== null'>
                <Card :configuration=confCardKwh :url=this.getCardKwhUrl()></Card>
                <Card :configuration=confCardCo2 :url=this.getCardCo2Url()></Card>
                <Card :configuration=confCardEnergeticEfficency :url=this.getCardEnergeticEfficiencyUrl()></Card>
                <div class="col-sm-6 col-xs-12">
                  <LineChart :configuration=confLineChartNameSpace :idL="'lineChartNamespaces'" :height=150 :dataS=this.nameSpaceData />
                </div>
                <div class="col-sm-6 col-xs-12">
                  <BarChart :configuration=confBarChartMetrics :idL="'barChartMetrics'"  :dataS=this.getMetrics() />
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

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../components/Card'),
    LineChart: () => import ('../components/charts/LineChart'),
    BarChart: () => import ('../components/charts/BarChart'),
  },
  data () {
    return {
      dateRange: null,
      lineChartNamespaces: null,
      barChartMetrics: null,
      selectNodes: null,
      activeNode: null,
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
    confLineChartNameSpace () {
      return {
        url: `${api}/nodes/${this.activeNode}/namespaces/rating`,
        id: 'lineChartNamespaces',
        sort: 'namespace',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Slices rates (in Euros)'
        }
      }
    },
    confCardKwh() {
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Node consumption',
        color: 'green',
        icon: 'far fa-lightbulb',
        type: 'sum',
        message: 'W/h',
        key: 'frame_price'
      }
    },
    confCardCo2() {
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Co2 Generation',
        color: 'green',
        icon: 'fas fa-cloud',
        message: 'kg',
        type: 'sum',
        key: 'frame_price'
      }
    },
    confCardEnergeticEfficency() {
      return {
        from: this.from,
        to: this.to,
        link: '/',
        label: 'Energy efficiency',
        color: 'green',
        icon: 'fas fa-cloud-meatball',
        type: 'avg',
        key: 'frame_price'
      }
    },
    nameSpaceData() {
      return this.getNamespaces();
    }
  },
  methods: {
    getCardKwhUrl() {
      return `${api}/nodes/${this.activeNode}/metrics/watt/rating`
    },
    getCardCo2Url() {
      return `${api}/nodes/${this.activeNode}/metrics/co2/rating`
    },
    getCardEnergeticEfficiencyUrl() {
      return `${api}/nodes/${this.activeNode}/metrics/energetic_efficiency/rating`
    },
    async getMetrics() {
      return await utils.get(`${api}/nodes/${this.activeNode}/rating`, this);
    },
    async getNamespaces() {
      if (!this.activeNode) {
        return {total: 0, results: []}
      }
      return await utils.get(`${api}/nodes/${this.activeNode}/namespaces/rating`, this)
    },
    refreshDate(date) {
      if (date) {
        this.dateRange = date;
      }
      utils.refreshDate(date, this)
    },
    showDatePicker() {
      return this.activeNode !== null
    },
    async getNodes (node) {
      this.activeNode = node.target.value
      this.refreshDate(null)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
        {'endpoint': `${api}/metrics`, 'key': 'metric'}
        ], this)
    },
  },
  async beforeMount() {
    await this.generateColor()
    this.selectNodes = (await utils.fetchData(`${api}/nodes`, this)).map(item => item.node)
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
</style>
