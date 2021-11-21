import VueApexCharts from 'vue-apexcharts'

export default {
    name: 'apexCharts',
    components: {
        apexcharts: VueApexCharts,
    },
    props: ['chartSeries', 'chartOptions'],
}

