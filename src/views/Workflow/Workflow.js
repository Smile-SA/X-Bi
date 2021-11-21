import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'

const api = generateAPIUrl()

export default {
  components: {
    Card: import('../../components/card/index.vue')
  },
  data () {
    return {
      cards: [],
      step: {},
      to: new Date().toISOString(),
      from: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      stepsSelect: [],
      activeStep: null
    }
  },
  computed: {},
  methods: {
    showButton() {
      return this.activeStep !== null
    },
    async createStep() {
      const url = `${api}/step/create`
      const create = this.createStepForm()
      const response = await fetch(url, {
        method: 'POST',
        body: create
      })
      const json = await response.json()
      if (response.status === 400) {
        alert(json.message)
      } else if (response.status === 200) {
        if (json.results !== false) {
          alert(`Step ${create.get('name').toString()} created.`)
        } else {
          alert(`A problem occured`)
        }
      }
    },
    async updateStep() {
      const url = `${api}/step/update`
      const update = this.createStepForm()
      const name = document.getElementById('input-name').value
      update.append('replace_name', name)
      update.set('name', this.activeStep)

      const response = await fetch(url, {
        method: 'POST',
        body: update
      })
      const json = await response.json()
      if (response.status === 400) {
        alert(json.message)
      } else if (response.status === 200) {
        if (json.results !== false) {
          alert(`Step ${name} updated.`)
        } else {
          alert(`A problem occured`)
        }
      }
    },
    createStepForm() {
      const step = {
        name: document.getElementById('input-name').value,
        sources: document.getElementById('input-sources').value,
        labels: document.getElementById('input-labels').value,
        operation: document.getElementById('input-operation').value
      }
      const formData = new FormData()
      formData.append('name', step.name)
      formData.append('sources', step.sources)
      formData.append('labels', JSON.stringify(step.labels))
      formData.append('operation', step.operation)
      return formData
    },
    async deleteStep() {
      const url = `${api}/step/${this.activeStep}/delete`
      const total = await utils.fetchTotal(url, this)
      return total
    },
    async getStep(step) {
      const url = `${api}/step/${step}/get`
      const results = await utils.fetchDataAsJSON(url, this)
      document.getElementById('input-name').value = results.results[0].name
      document.getElementById('input-sources').value = results.results[0].sources.toString().replace(',', ' ')
      document.getElementById('input-labels').value = JSON.stringify(results.results[0].labels)
      document.getElementById('input-operation').value = results.results[0].operation
      return results.results[0]
    },
    async refresh() {
      this.getStep(this.activeStep)
    },
    async getSteps(step) {
      const url = `${api}/steps`

      if (step !== undefined) {
        this.cards = []
        this.activeStep = step.target.value
        this.refresh(null)
      }
      this.stepsSelect = (await utils.fetchData(url, this)).map(item => item.step)
    }
  },
  async mounted() {
    await this.getSteps()
  }
}