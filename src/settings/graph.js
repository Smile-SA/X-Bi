import * as utils from './utils'
import Chart from 'chart.js'

export async function drawPieChart(c) {
  // if (c.graph !== null) {
  //   c.graph.destroy()
  // }

  const {total, results} = await utils.fetchDataAsJSON(c.url, c.context)
  if (total === 0) {
    return c.graph
  }

  const queryDate = utils.convertURLDateParameter(c.context.from, c.context.to)

  let dataset = utils.groupBy(results, c.sort)
  const labels = [...Object.keys(dataset)]
  const colors = [...Object.keys(dataset)].map((item) => c.context.colors[item])
  dataset = [...Object.values(dataset)].map((item) => item.length)

  const ctx = document.getElementById(c.id).getContext('2d')
  const config = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: dataset,
        backgroundColor: colors
      }],
      labels: labels
    },
    options: {
      title: {
        fontSize: 20,
        display: true,
        text: c.labels.title
      },
      responsive: true,
      maintainAspectRatio: !c.context.isMobile,
      legend: {
        display: false
      },
      tooltips: {
        intersect: false,
        mode: 'label'
      }
    }
  }
  c.context.queryArray[c.id] = `${c.url}${queryDate}`
  return new Chart(ctx, config)
}

export async function drawBarChart(c) {
  if (c.graph !== null) {
    c.graph.destroy()
  }

  const {total, results} = await utils.fetchDataAsJSON(c.url, c.context)
  if (total === 0) {
    return c.graph
  }

  const queryDate = utils.convertURLDateParameter(c.context.from, c.context.to)
  const ctx = document.getElementById(c.id).getContext('2d')

  const graph = []
  const dataset = utils.groupBy(results, c.sort)
  const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

  labels.forEach((item, count) => {
    labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
  })

  let min = 0
  let max = 0
  Object.keys(dataset).forEach(item => {
    const obj = []
    const color = c.context.colors[item]
    Object.values(dataset[item]).forEach(subItem => {
      const fixed = subItem[c.labels.value].toFixed(5)
      const minTmp = Math.min(fixed)
      const maxTmp = Math.max(fixed)
      if (min === 0 || minTmp < min) {
        min = minTmp
      }
      if (max === 0 || maxTmp > max) {
        max = maxTmp
      }
      obj.push(fixed)
    })
    graph.push({
      label: item,
      fill: true,
      backgroundColor: color,
      data: obj
    })
  })
  const config = {
    type: 'bar',
    data: {
      datasets: graph,
      labels: labels
    },
    options: {
      title: {
        fontSize: 20,
        display: true,
        text: c.labels.title
      },
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          stacked: true,
          display: true,
          scaleLabel: {
            display: true
          },
          ticks: {
            beginAtZero: true,
            fontSize: 15,
            callback: function(value, index, values) {
              if (index === values.length - 1) return min.toFixed(5)
              else if (index === Math.trunc(values.length / 2)) {
                return ((max + min) / 2).toFixed(5)
              }
              else if (index === 0) return max.toFixed(5)
              else return ''
            }
          }
        }]
      },
      responsive: true,
      tooltips: {
        intersect: false,
        mode: 'label'
      }
    }
  }
  c.context.queryArray[c.id] = `${c.url}${queryDate}`
  return new Chart(ctx, config)
}

export async function prometheusLineGraphConfig(config) {
  const response = await fetch(
    `${config.url}?query=${encodeURIComponent(config.query)}&start=${config.start}&end=${config.end}&step=30s`,
    { method: 'GET' })
  const json = await response.json()
  const graph = []
  let labels = null
  for (let data of json.data.result) {
    const color = utils.getRandomColor()
    const l = []
    const d = []
    for (let iteration of data.values) {
      l.push(new Date(iteration[0]*1000).toISOString().split('T')[1])
      d.push(iteration[1])
    }
    if (labels === null) {
      labels = l
    }
    graph.push({
      data: d,
      label: `{'namespace': ${data.metric.namespace}, 'node': ${data.metric.node}, 'pod': ${data.metric.pod}}`,
      backgroundColor: color,
      borderColor: color,
      pointBackgroundColor: color,
      fill: false
    })
  }
  return {
    type: 'line',
    data: {
      datasets: graph,
      labels: labels
    },
    options: {
      elements: {
        point: {
          radius: 1
        },
        line: {
          tension: 0,
          fill: false,
          steppedLine: false,
          borderDash: []
        }
      },
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      title: {
        fontSize: 20,
        display: true,
        text: config.title
      },
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true
          },
          ticks: {
            fontSize: 15
          }
        }]
      },
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        intersect: false,
        mode: 'label'
      }
    }
  }
}