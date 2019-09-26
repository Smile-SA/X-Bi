<template>
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a version</h4>
        <select class="form-control" v-on:change="getVersion">
          <option selected disabled> -- Select a version -- </option>
          <option v-for="option in selectForm" v-bind:value="option" v-bind:key="option">{{option}}</option>
        </select>
      </div>
      <div>
        <button @click="newConfig()">  NEW </button>
      </div>
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
    <div class="input-area" v-if="showYaml">
      <p>metrics.yaml</p>
      <highlight-code lang="yaml">
        {{ metrics }}
      </highlight-code>
      <p>nodes.yaml</p>
      <highlight-code lang="yaml">
        {{ nodes }}
      </highlight-code>
      <p>rules.yaml</p>
      <highlight-code lang="yaml">
        {{ rules }}
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
      nodes: null,
      rules: null,
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
    showYaml() {
      return this.metrics !== null
    },
    newConfig() {
      const formData = new FormData();
      formData.append('metrics', JSON.stringify(this.metrics))
      formData.append('nodes', JSON.stringify(this.nodes))
      formData.append('rules', JSON.stringify(this.rules))
      let url = `${api}/rating/config/new`
      fetch(url, {
        method: 'POST',
        body: formData
      })
    },
    async drawYaml() {
      let url = `${api}/rating/config/${this.activeVersion}` 

      let data = await utils.fetchDataAsJSON(url, this)
      this.metrics = data.results.metrics
      this.nodes = data.results.nodes
      this.rules = data.results.rules
    },
    async getVersion(version) {
      let url = `${api}/rating/configs/list`
      
      if (version !== undefined) {
        this.cards = []
        this.activeVersion = version.target.value
        this.drawCards()
        this.drawYaml()
      }
      let results = await utils.fetchData(url, this)
      this.selectForm = results.map(item => item)
    },
    async versionMetricsCard() {
      if (this.activeVersion === null   ) {
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
      this.versionMetricsCard()
    }
  },
  mounted() {
    this.getVersion()
  }
}

</script>

<style>
</style>