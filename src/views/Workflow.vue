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
              <form>
                <legend>Step form</legend>
                <p>
                  <input type="text" name="name" id="input-name">
                  <label for="input-name">Name</label>
                </p>
                <p>
                  <input type="text" name="sources" id="input-sources">
                  <label for="input-sources">Sources</label>
                </p>
                <p>
                  <input type="text" name="labels" id="input-labels">
                  <label for="input-labels">Labels</label>
                </p>
                <p>
                  <input type="text" name="operation" id="input-operation">
                  <label for="input-operation">Operation</label>
                </p>
              </form>
              <div v-if='!showButton()'>
                <a href="#" @click="createStep()" class="export-button">Create</a>
              </div>
              <div v-if='showButton()'>
                <a href="#" @click="updateStep()" class="export-button">Update</a>
              </div>
              <div v-if='showButton()'>
                <a href="#" @click="deleteStep()" class="export-button">Delete</a>
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
            const results = await utils.fetchData(url, this)
            this.stepsSelect = results.map(item => item.step)
        }
    },
    async mounted() {
        await this.getSteps()
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