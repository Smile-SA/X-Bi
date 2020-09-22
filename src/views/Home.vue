<template>
  <section class="content">
    <div id="app" class="form-group col-xs-2">
      <h4>Select a date</h4>
      <VueRangedatePicker  id="rangeDatePicker" v-model="date" i18n="EN" @selected="refreshDate"/>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header">
            <div class="row">
            <h3 class="box-title"></h3>
              <Card :configuration=confCardNamespaces :url=this.getCardNamespacesUrl()></Card>
              <Card :configuration=confCardNodes :url=this.getCardNodesUrl()></Card>
              <Card :configuration=confCardPods :url=this.getCardPodsUrl()></Card>
              <div>
                <div>
                  <VueContext ref="menu">
                    <ul>
                      <li @click="getURL">JSON</li>
                      <li @click="getURL">CSV</li>
                    </ul>
                  </VueContext>
                    <LineChart class="pointer" :configuration=confLineChartNodes :idL="'lineChartNodes'" :height=80 :dataS=this.getNodes() />
                    <LineChart class="pointer" :configuration=confLineChartNameSpace :idL="'lineChartNamespaces'" :height=80 :dataS=this.getNamespaces() />
                </div>
              </div>
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

const api = generateAPIUrl()

export default {
  components: {
    Card: () => import('../components/Card'),
    LineChart: () => import ('../components/charts/LineChart')
  },
    data() {
        return {
            date: null,
            lineChartNodes: null,
            lineChartNamespaces: null,
            dateRange: null,
            colors: {},
            to: new Date().toISOString(),
            from: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
        }
    },
  computed: {
    isMobile() {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    },
    confLineChartNameSpace() {
      return {

        id: 'lineChartNamespaces',
        sort: 'namespace',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Slices rate (in Euros)'
        }
      }
    },
    confLineChartNodes() {
      return {
        id: 'lineChartNodes',
        sort: 'node',
        colors: this.colors,
        isMobile: this.isMobile,
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Nodes rate (in Euros)'
        }
      }
    },
    confCardNamespaces() {
      return {
        from: this.from,
        to: this.to,
        link: '/namespaces',
        label: 'Namespaces',
        color: 'purple',
        icon: 'slice-icon svg-inline--fa fa-w-16',
        type: 'number'
      }
    },
    confCardPods() {
      return {
        from: this.from,
        to: this.to,
        link: '/pods',
        label: 'Pods',
        color: 'blue',
        icon: 'fa fa-sitemap',
        type: 'number'
      }
    },
    confCardNodes() {
      return {
        from: this.from,
        to: this.to,
        link: '/nodes',
        label: 'Nodes',
        color: 'red',
        icon: 'fa fa-server',
        type: 'number'
      }
    },
  },
  methods: {

    async getNodes() {
      return await utils.fetchDataAsJSON(`${api}/nodes/rating`, this);
    },
    async getNamespaces() {
      return await utils.fetchDataAsJSON(`${api}/namespaces/rating`, this);
    },
    getCardNamespacesUrl() {
      return `${api}/namespaces`
    },
    getCardPodsUrl() {
      return `${api}/pods`
    },
    getCardNodesUrl() {
      return `${api}/nodes`
    },
    clicked(data) {
      this.selected = data.target.id
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    refreshDate(date) {
      this.dateRange = date;
      utils.refreshDate(date, this)
    },
    async generateColor() {
      this.colors = await utils.generateColor([
        {'endpoint': `${api}/namespaces`, 'key': 'namespace'},
        {'endpoint': `${api}/nodes`, 'key': 'node'},
        ], this)
    }
  },
  async beforeMount() {
    await this.generateColor()
    this.drawCards()
  },
  async mounted() {}
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

.centered-icon {
  text-align: center;
}

</style>
