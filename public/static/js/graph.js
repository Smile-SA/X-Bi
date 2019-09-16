import * as utils from './utils'
import Chart from 'chart.js'

export function generateLineGraph(response, c) {
  let graph = []
  let dataset = utils.groupBy(response, c.sort)
  let labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

  labels.forEach((item, count) => {
    labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'})
  })

  Object.keys(dataset).forEach(item => {
    let obj = []
    let color = c.context.colors[item]
    Object.values(dataset[item]).forEach(subItem => {
      obj.push(subItem[c.labels.value].toFixed(5))
    })
    graph.push({
      label: item,
      fill: true,
      borderColor: color,
      pointBackgroundColor: color,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      data: obj
    })
  })

  var ctx = document.getElementById(c.id).getContext('2d')
  var config = {
    type: 'line',
    data: {
      labels: labels,
      datasets: graph
    },
    options: {
      animation: false,
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 10
          },
          display: true,
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: c.labels.yLabel
          }
        }]
      },
      title: {
        display: true,
        text: c.labels.title
      },
      maintainAspectRatio: !c.context.isMobile,
      legend: {
        position: 'top',
        display: true
      },
      tooltips: {
        intersect: false,
        mode: 'label'
      }
    }
  }
  return {ctx: ctx, config: config} // eslint-disable-line no-new
}

export async function drawLineChart(c) {
  if (c.graph !== null) {
    c.graph.destroy()
  }
  let {total, results} = await utils.fetchDataAsJSON(c.url, c.context)
  if (total === 0) {
    return c.graph
  }
  let {ctx, config} = await this.generateLineGraph(results, c)
  let queryDate = utils.convertURLDateParameter(c.context.from, c.context.to) 
  c.context.queryArray[c.id] = `${c.url}${queryDate}`
  return new Chart(ctx, config)
}