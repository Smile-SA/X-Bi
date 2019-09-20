<template>
  <section class="content">
    <div class="form-group col-xs-2">
      <h4>Select a version</h4>
      <select class="form-control" v-on:change="getVersion">
        <option selected disabled> -- Select a version -- </option>
        <option v-for="option in selectForm" v-bind:value="option" v-bind:key="option">{{option}}</option>
      </select>
    </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <highlight-code lang="yaml">
        {{ metrics }}
      </highlight-code>
    </div>
  </section>
</template>

<script>
import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'

const api = generateAPIUrl()

export default {
  data () {
    return {
      cards: [],
      metrics: null,
      metricsObject: null,
      selectForm: [],
      activeVersion: 0,
      activeVersionMetrics: 0,
      from: null,
      to: null
    }
  },
  methods: {
    redirect(data) {
      utils.redirectCard(data, this)
    },
    async getVersion(version) {
      // let url = `${api}/rating/versions`
      
      if (version !== undefined) {
        this.cards = []
        this.activeVersion = version.target.value
        this.drawCards()
      }
      // let results = await utils.fetchData(url, this)
      this.selectForm = ['1.0', '2.0', '3.0', '4.0']
      // this.selectForm = results.map(item => item.version)
    },
    // parseYaml(content) {
      // const loaded = require('js-yaml').safeLoad(this.metrics)

    // }
    async versionsCard() { // List number of version
      let url = `${api}/rating/versions`
      this.cards.push({
        value: this.selectForm.length,
        link: '/',
        label: 'Available versions',
        color: 'purple',
        icon: 'diaspora'
      })
    },
    async metricsCard() {
      let url = `${api}/rating/metrics`
      this.cards.push({
        value: await utils.fetchTotal(url, this),
        link: '/',
        label: 'Rated metrics',
        color: 'red',
        icon: 'server'
      })
    },
    async versionMetricsCard() {
      if (this.activeVersion === 0) {
        return
      }
      this.cards.push({
        value: this.activeVersion,
        link: '/',
        label: 'Version',
        color: 'green',
        icon: 'diaspora'
      })
    },
    drawCards() {
      this.metricsCard()
      this.versionsCard()
      this.versionMetricsCard()
    }
  },
  mounted() {
    this.metrics = `
    ruleset:
      metadata:
        version: "1.0"
        validity:
          start: "2019-09-15T17:39:10Z"
          end: "2019-09-18T17:39:10Z"
      rules_storage:
        node_type: hdd
        rules:
        -
          metric: request_cpu
          price: 0.00075
          unit: core-hours
        -
          metric: usage_cpu
          price: 0.0015
          unit: core-hours
        -
          metric: request_memory
          price: 0.0007
          unit: GiB-hours
        -
          metric: usage_memory
          price: 0.0014
          unit: GiB-hours
      rules_default:
        node_type: default
        rules:
        -
          metric: request_cpu
          price: 0.005
          unit: core-hours
        -
          metric: usage_cpu
          price: 0.015
          unit: core-hours
        -
          metric: request_memory
          price: 0.004
          unit: GiB-hours
        -
          metric: usage_memory
          price: 0.012
          unit: GiB-hours
    `
    // let meta = this.metricsObject.ruleset.metadata
    // console.log(meta.version, meta.validity.start, meta.validity.end)
    // this.parseYaml(this.metrics)
    this.getVersion()
    this.drawCards()
  }
}

</script>

<style>
</style>