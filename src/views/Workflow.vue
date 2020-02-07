<template>
  <!-- Main content -->
  <section class="content">
    <div class="row">
      <div class="form-group col-xs-2">
          <h4>Select a step</h4>
          <select class="form-control" v-on:change="getSteps">
              <option selected disabled> -- Select a step -- </option>
              <option v-for="option in stepsSelect" v-bind:value="option" v-bind:key="option">{{option}}</option>
          </select>
      </div>
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header">
            <div class="row">
            <h3 class="box-title"></h3>
              <div class="col-md-4 col-sm-6 col-xs-12 column" v-for="card in cards" v-bind:key="card.label">
                <div v-bind:class="'info-box bg-' + card.color">
                  <span class="info-box-icon"><svg v-bind:class="'' + card.icon"></svg></span>

                  <div class="info-box-content" @click="redirect(card)">
                    <div style="text-align: center;">
                      <p></p>
                      <span class="info-box-text">{{card.label}}</span>
                      <span class="info-box-number">{{card.value}}</span>
                    </div>
                  </div>
                  <!-- /.info-box-content -->
                </div>
              </div>
              <div class="form-center">
                <form class="form-inline">
                  <legend>Step form</legend>
                  <p>
                    <label for="input-name">Name</label>
                    <input type="text" name="name" id="input-name">
                  </p>
                  <p>
                    <label for="input-sources">Sources</label>
                    <input type="text" name="sources" id="input-sources">
                  </p>
                  <p>
                    <label for="input-labels">Labels</label>
                    <input type="text" name="labels" id="input-labels">
                  </p>
                  <p>
                    <label for="input-operation">Operation</label>
                    <input type="text" name="operation" id="input-operation">
                  </p>
                  <!-- <button type="submit">Create</button> -->
                  <div v-if='!showButton()'>
                    <a href="#" @click="createStep()" class="button-valid">Create</a>
                  </div>
                  <div v-if='showButton()'>
                    <a href="#" @click="updateStep()" class="button-valid">Update</a>
                  </div>
                  <div v-if='showButton()'>
                    <a href="#" @click="deleteStep()" class="button-valid">Delete</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /.row -->

    <!-- Main row -->
    <!-- /.row -->
  </section>
  <!-- /.content -->
</template>

<script>

import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'

const api = generateAPIUrl()

export default {
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

</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;}
* {box-sizing: border-box;}


.form-center {
  text-align: center;
  display: flex;
}

.button-valid {
  background:    #0c67a4;
  border-radius: 2px;
  padding:       8px 20px;
  color:         #ffffff;
  display:       inline-block;
  font:          normal bold 20px/1 "Open Sans", sans-serif;
  text-align:    center;
  padding: 15px 40px;
  outline: 2px solid white;
  outline-offset: 2px;
}

.form-inline {  
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.form-inline label {
  margin: 5px 10px 5px 0;
}

.form-inline input {
  vertical-align: middle;
  margin: 5px 10px 5px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.form-inline button {
  padding: 10px 20px;
  background-color: dodgerblue;
  border: 1px solid #ddd;
  color: white;
  cursor: pointer;
}

.form-inline button:hover {
  background-color: royalblue;
}

@media (max-width: 800px) {
  .form-inline input {
    margin: 10px 0;
  }
  
  .form-inline {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>