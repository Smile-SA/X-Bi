<template>
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
        <h4>Select a version</h4>
        <select class="form-control" v-on:change="getVersion">
          <option selected disabled> -- Select a version -- </option>
          <option v-for="option in configListIndexes" v-bind:value="option" v-bind:key="option">{{option}}</option>
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
    <div v-if='showYaml()'>
      <div>
        <a href="#" @click="newConfig()" class="export-button">CREATE CONFIGURATION</a>
      </div>
      <div v-if='canDeleteConfig()'>
        <a href="#" @click="deleteConfig()" class="export-button">DELETE CONFIGURATION</a>
      </div>
      <b></b>
      <div class="input-area" v-if="showYaml()">
        <code id="metrics-display" class="lang-yaml">
          <pre contenteditable required>
{{ metricsYAML }}
          </pre>
        </code>
        <code id="rules-display" class="lang-yaml">
          <pre contenteditable required>
{{ rulesYAML }}
          </pre>
        </code>
      </div>
    </div>
  </section>
</template>

<script>
import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'
import YAML from 'js-yaml'

const api = generateAPIUrl()

export default {
  data () {
    return {
      cards: [],
      metrics: null,
      metricsYAML: null,
      rules: null,
      rulesYAML: null,
      metricsObject: null,
      configList: [],
      configListIndexes: [],
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
             this.rules !== null
    },
    canDeleteConfig() {
      return this.timestampFromDate(this.activeVersion) !== 0
    },
    async deleteConfig() {
      const active = this.timestampFromDate(this.activeVersion)
      if (active === 0) {
        alert('Cannot remove the base config')
        return
      }
      const url = `${api}/rating/config/delete/${active}`
      const response = await fetch(url)
      const json = await response.json()
      const message = `Configuration ${json.results} deleted.`
      alert(message)
    },
    async newConfig() {
      this.metrics = YAML.load(document.getElementById('metrics-display').innerText)
      this.rules = YAML.load(document.getElementById('rules-display').innerText)
      const formData = new FormData()
      formData.append('metrics', JSON.stringify(this.metrics))
      formData.append('rules', JSON.stringify(this.rules))

      const url = `${api}/rating/config/new`
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      const json = await response.json()
      if (response.status === 400) {
        alert(json.message)
      } else if (response.status === 200) {
        alert(`Configuration ${json.results} created.`)
      }
    },
    async drawYaml() {
      const active = this.timestampFromDate(this.activeVersion)
      const url = `${api}/rating/config/${active}` 

      const data = await utils.fetchDataAsJSON(url, this)

      this.rules = data.results.rules
      this.rulesYAML = YAML.dump(this.rules, 4)

      this.metrics = data.results.metrics
      this.metricsYAML = YAML.dump(this.metrics, 4)
    },
    async getVersion(version) {
      const url = `${api}/rating/configs/list`

      if (version !== undefined) {
        this.cards = []
        this.activeVersion = this.configList[version.target.value]
        this.drawCards()
        this.drawYaml()
      }
      const results = await utils.fetchData(url, this)
      this.configList = results.map(item => new Date(item * 1000).toLocaleString('en-US'))
      this.configListIndexes = []
      for (let idx = 0; idx < this.configList.length; idx++) {
        this.configListIndexes.push(idx)
      }
    },
    timestampFromDate(date) {
      return Date.parse(date) / 1000
    },
    async versionMetricsCard() {
      this.cards.push({
        value: this.timestampFromDate(this.activeVersion),
        link: '/',
        label: 'Configuration timestamp',
        color: 'green',
        icon: 'wrench'
      })
    },
    async appliedFromToCard() {
      const idx = this.activeVersion
      let msg = ""
      if (idx < this.configList.length - 1) {
        msg = `From ${this.activeVersion} to ${this.configList[idx + 1]}`
      } else {
        msg = `From ${this.activeVersion} to now`
      }
      this.cards.push({
        value: msg,
        link: '/',
        label: 'Timeframe',
        color: 'blue',
        icon: 'wrench'
      })
    },
    drawCards() {
      this.versionMetricsCard()
      this.appliedFromToCard()
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