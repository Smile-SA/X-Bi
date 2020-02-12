<template>
  <!-- Main content -->
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
              <div>
                <div>
                  <div class="col-sm-12">
                    <p class="text-center">
                      <strong v-if="lineChartRequestCpu">{{lineChartRequestCpu.title}}</strong>
                    </p>
                    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartRequestCpu" height="80%"></canvas>
                  </div>
                  <div class="col-sm-12">
                    <p class="text-center">
                      <strong v-if="lineChartUsageCPU">{{lineChartUsageCPU.title}}</strong>
                    </p>
                    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartUsageCPU" height="80%"></canvas>
                  </div>
                  <div class="col-sm-12">
                    <p class="text-center">
                      <strong v-if="lineChartRequestMemory">{{lineChartRequestMemory.title}}</strong>
                    </p>
                    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartRequestMemory" height="80%"></canvas>
                  </div>
                  <div class="col-sm-12">
                    <p class="text-center">
                      <strong v-if="lineChartUsageMemory">{{lineChartUsageMemory.title}}</strong>
                    </p>
                    <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" id="lineChartUsageMemory" height="80%"></canvas>
                  </div>
                </div>
              </div>

              <!-- <hr class="visible-xs-block"> -->

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

import { generatePromUrl } from '../variables'
import * as utils from  '../utils'
import * as graph from '../graph'

const api = generatePromUrl()

export default {
  data() {
    return {
      date: null,
      lineChartRequestMemory: null,
      lineChartRequestCpu: null,
      lineChartUsageCPU: null,
      lineChartUsageMemory: null,
      colors: {},
      to: Math.floor(new Date().getTime()/1000),
      from: Math.floor(new Date(new Date().setMinutes(new Date().getMinutes() - 60)).getTime()/1000),
    }
  },
  computed: {
    isMobile() {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    }
  },
  methods: {
    clicked(data) {
      this.selected = data.target.id
    },
    redirect(data) {
      utils.redirectCard(data, this)
    },
    getURL(data) {
      utils.getURL(data, this)
    },
    refreshDate(date) {
      utils.refreshDate(date, this)
    },
    async drawLineChartRequestMemory() {
      this.lineChartRequestMemory = await graph.prometheusGraphLine({
        url: `${api}/query_range`,
        query: 'sum(kube_pod_container_resource_requests_memory_bytes) by (pod, namespace, node) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        graph: this.lineChartRequestMemory,
        id: 'lineChartRequestMemory',
        title: `Memory request since ${new Date(this.from*1000)}`
      })
    },
    async drawLineChartUsageMemory() {
      this.lineChartUsageMemory = await graph.prometheusGraphLine({
        url: `${api}/query_range`,
        query: 'sum(container_memory_usage_bytes) by (pod, namespace) + on (pod, namespace) group_left(node) (sum(kube_pod_info{pod_ip!="",node!="",host_ip!=""}) by (pod, namespace, node) * 0) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        graph: this.lineChartUsageMemory,
        id: 'lineChartUsageMemory',
        title: `Usage memory since ${new Date(this.from*1000)}`
      })
    },
    async drawLineChartRequestCPU() {
      this.lineChartRequestCpu = await graph.prometheusGraphLine({
        url: `${api}/query_range`,
        query: 'sum(kube_pod_container_resource_requests_cpu_cores) by (pod, namespace, node) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        graph: this.lineChartRequestCpu,
        id: 'lineChartRequestCpu',
        title: `CPU request since ${new Date(this.from*1000)}`
      })
    },
    async drawLineChartUsageCPU() {
      this.lineChartUsageCPU = await graph.prometheusGraphLine({
        url: `${api}/query_range`,
        query: 'sum(rate(container_cpu_usage_seconds_total[1m])) BY (pod, namespace) + on (pod, namespace) group_left(node) (sum(kube_pod_info{pod_ip!="",node!="",host_ip!=""}) by (pod, namespace, node) * 0) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        graph: this.lineChartUsageCPU,
        id: 'lineChartUsageCPU',
        title: `CPU Usage since ${new Date(this.from*1000)}`
      })
    },
    async drawGraphs() {
      await this.drawLineChartRequestMemory()
      await this.drawLineChartRequestCPU()
      await this.drawLineChartUsageCPU()
      await this.drawLineChartUsageMemory()
    },
  },
  async mounted() {
    this.drawGraphs()
  }
}
</script>

<style>

.slice-icon {
  background-image: url('../../public/static/img/5GBiller_-__Slices_-_logo_-_whiteV2.svg');
  background-repeat: no-repeat;
  border-top-left-radius: 2px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 2px;
  width: 45px;
  font-size: 45px;
  text-align: center;
}
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
