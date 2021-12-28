import VueApexCharts from 'vue-apexcharts'

export default {
    name: 'apexCharts',
    components: {
        apexcharts: VueApexCharts,
    },
    props:['chartOptions','chartSeries','height','id'],
    // methods : {
    //     graphConfiguration(response, c) {
    //         this.chartOptions = [];
    //
    //         const dataset = utils.groupBy(response, c.sort)
    //
    //         const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])
    //
    //         labels.forEach((item, count) => {
    //             labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
    //         })
    //
    //         let min = 0
    //         let max = 0
    //         Object.keys(dataset).forEach(item => {
    //             const obj = []
    //             const color = c.colors[item]
    //             Object.values(dataset[item]).forEach(subItem => {
    //                 const fixed = subItem[c.labels.value].toFixed(5)
    //                 const minTmp = Math.min(fixed)
    //                 const maxTmp = Math.max(fixed)
    //                 if (min === 0 || minTmp < min) {
    //                     min = minTmp
    //                 }
    //                 if (max === 0 || maxTmp > max) {
    //                     max = maxTmp
    //                 }
    //                 obj.push(fixed)
    //             })
    //             this.chartOptions.push({
    //                 label: item,
    //                 fill: true,
    //                 borderColor: color,
    //                 pointBackgroundColor: color,
    //                 backgroundColor: 'rgba(0, 0, 0, 0)',
    //                 data: obj
    //             })
    //         })
    //
    //
    //         this.nodeOptions = {
    //             chart: {
    //                 id: c.id,type:'line'
    //             },
    //             xaxis: {
    //                 categories: labels,
    //             },
    //             title: {
    //                 text: c.labels.title,
    //                 style: {
    //                     fontSize:  '20px',
    //                 },
    //             }
    //         };
    //
    //         return { config: this.nodeOptions, data:this.chartOptions}
    //     },
    // }
}

