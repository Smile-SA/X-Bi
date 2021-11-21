import {generateAPIUrl} from '../../variables'
import * as utils from '../../utils'
import YAML from 'js-yaml'

const api = generateAPIUrl()

export default {
  components: {
    Card: import('../../components/card/index.vue')
  },
  data() {
    return {
      cards: [],
      metrics: null,
      metricsYAML: null,
      rules: null,
      rulesYAML: null,
      configList: [],
      configListIndexes: [],
      activeVersion: 0,
      from: null,
      to: null
    }
  },
  methods: {
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
      const url = `${api}/rating/configs/${active}`

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
      const idx = this.configList.findIndex((item) => item == this.activeVersion)
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