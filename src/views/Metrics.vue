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
    <div>
      <div v-if='showYaml()'>
        <a href="#" @click="newConfig()" class="export-button">EXPORT CONFIGURATION</a>
      </div>
      <b></b>
      <div class="input-area" v-if="showYaml()">
        <p><b>metrics.yaml</b></p>
        <highlight-code id="metric-display" contentEditable="true" lang="yaml">
          {{ transformJSONtoYAML(metrics) }}
        </highlight-code>
        <p><b>nodes.yaml</b></p>
        <highlight-code id="nodes-display" contenteditable="true" lang="yaml">
          {{ transformJSONtoYAML(nodes) }}
        </highlight-code>
        <p><b>rules.yaml</b></p>
        <highlight-code id="rules-display" contentEditable="true" lang="yaml">
          {{ transformJSONtoYAML(rules) }}
        </highlight-code>
      </div>
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
      return this.metrics !== null ||
            this.nodes !== null ||
            this.rules !== null
    },
    transformJSONtoYAML(thing) {
      return YAML.stringify(thing, 4)
    },
    newConfig() {
      this.metrics = YAML.parse(document.getElementById('metric-display').innerText)
      this.nodes = YAML.parse(document.getElementById('nodes-display').innerText)
      this.rules = YAML.parse(document.getElementById('rules-display').innerText)
      const formData = new FormData()
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
        label: 'Selected version',
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
.export-button {
	-moz-box-shadow: 0px 10px 14px -7px #276873;
	-webkit-box-shadow: 0px 10px 14px -7px #276873;
	box-shadow: 0px 10px 14px -7px #276873;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #599bb3), color-stop(1, #408c99));
	background:-moz-linear-gradient(top, #599bb3 5%, #408c99 100%);
	background:-webkit-linear-gradient(top, #599bb3 5%, #408c99 100%);
	background:-o-linear-gradient(top, #599bb3 5%, #408c99 100%);
	background:-ms-linear-gradient(top, #599bb3 5%, #408c99 100%);
	background:linear-gradient(to bottom, #599bb3 5%, #408c99 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#599bb3', endColorstr='#408c99',GradientType=0);
	background-color:#599bb3;
	-moz-border-radius:8px;
	-webkit-border-radius:8px;
	border-radius:8px;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:14px;
	font-weight:bold;
	padding:13px 32px;
	text-decoration:none;
	text-shadow:0px 1px 0px #3d768a;
  margin-bottom: 10px;
}
.export-button:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #408c99), color-stop(1, #599bb3));
	background:-moz-linear-gradient(top, #408c99 5%, #599bb3 100%);
	background:-webkit-linear-gradient(top, #408c99 5%, #599bb3 100%);
	background:-o-linear-gradient(top, #408c99 5%, #599bb3 100%);
	background:-ms-linear-gradient(top, #408c99 5%, #599bb3 100%);
	background:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#408c99', endColorstr='#599bb3',GradientType=0);
	background-color:#408c99;
}
.export-button:active {
	position:relative;
	top:1px;
}

</style>