import Chart from 'chart.js'
import { generatePromUrl } from '../../settings/variables'
import * as graph from '../../settings/graph'
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
    async drawLineChartRequestMemory() {
      await this.addLineChart({
        url: `${api}/query_range`,
        query: 'sum(kube_pod_container_resource_requests_memory_bytes) by (pod, namespace, node) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        id: 'lineChartRequestMemory',
        title: `Memory request since ${new Date(this.from*1000)}`
      })
    },
    async drawLineChartUsageMemory() {
      await this.addLineChart({
        url: `${api}/query_range`,
        query: 'sum(container_memory_usage_bytes) by (pod, namespace) + on (pod, namespace) group_left(node) (sum(kube_pod_info{pod_ip!="",node!="",host_ip!=""}) by (pod, namespace, node) * 0) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        id: 'lineChartUsageMemory',
        title: `Usage memory since ${new Date(this.from*1000)}`
      })
    },
    async drawLineChartRequestCPU() {
      await this.addLineChart({
        url: `${api}/query_range`,
        query: 'sum(kube_pod_container_resource_requests_cpu_cores) by (pod, namespace, node) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        id: 'lineChartRequestCpu',
        title: `CPU request since ${new Date(this.from*1000)}`
      })
    },
    async drawLineChartUsageCPU() {
      await this.addLineChart({
        url: `${api}/query_range`,
        query: 'sum(rate(container_cpu_usage_seconds_total[1m])) BY (pod, namespace) + on (pod, namespace) group_left(node) (sum(kube_pod_info{pod_ip!="",node!="",host_ip!=""}) by (pod, namespace, node) * 0) + on (node) group_left(label_beta_kubernetes_io_instance_type) (sum(kube_node_labels) by (node,label_beta_kubernetes_io_instance_type) * 0)',
        start: this.from,
        end: this.to,
        id: 'lineChartUsageCPU',
        title: `CPU Usage since ${new Date(this.from*1000)}`
      })
    },
    async addLineChart(config) {
      const div = document.getElementById('lineChartSpot')
      const graphData = await graph.prometheusLineGraphConfig(config)
      const canvas = document.createElement('canvas')
      canvas.id = config.id
      div.appendChild(canvas)
      const ctx = document.getElementById(config.id)
      return new Chart(ctx, graphData)
    },
  },
  async mounted() {
    this.drawLineChartRequestMemory()
    this.drawLineChartRequestCPU()
    this.drawLineChartUsageCPU()
    this.drawLineChartUsageMemory()
  }
}