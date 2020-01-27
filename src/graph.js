import * as utils from './utils'
import Chart from 'chart.js'

export function generateLineGraph(response, c) {
  let graph = []
  const dataset = utils.groupBy(response, c.sort)
  let labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

  labels.forEach((item, count) => {
    labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
  })

  let min = 0
  let max = 0
  Object.keys(dataset).forEach(item => {
    let obj = []
    const color = c.context.colors[item]
    Object.values(dataset[item]).forEach(subItem => {
      let fixed = subItem[c.labels.value].toFixed(5)
      let minTmp = Math.min(fixed)
      let maxTmp = Math.max(fixed)
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
      borderColor: color,
      pointBackgroundColor: color,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      data: obj
    })
  })

  const ctx = document.getElementById(c.id).getContext('2d')
  const config = {
    type: 'line',
    data: {
      labels: labels,
      datasets: graph
    },
    options: {
      elements: {
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
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 10,
            fontSize: 15
          },
          display: true,
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true
          },
          ticks: {
            fontSize: 15,
            min: min,
            max: max,
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
      title: {
        display: true,
        text: c.labels.title,
        fontSize: 20
      },
      maintainAspectRatio: !c.context.isMobile,
      legend: {
        position: 'top',
        display: true
      },
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            const label = data.datasets[tooltipItem.datasetIndex].label
            return `${label}: ${tooltipItem.yLabel}`
          }
        }
      }
    }
  }
  return {ctx: ctx, config: config} // eslint-disable-line no-new
}

export async function drawLineChart(c) {
  if (c.graph !== null) {
    c.graph.destroy()
  }
  const {total, results} = await utils.fetchDataAsJSON(c.url, c.context)
  if (total === 0) {
    return c.graph
  }
  const {ctx, config} = generateLineGraph(results, c)
  const queryDate = utils.convertURLDateParameter(c.context.from, c.context.to) 
  c.context.queryArray[c.id] = `${c.url}${queryDate}`
  return new Chart(ctx, config)
}

export async function drawPieChart(c) {
  if (c.graph !== null) {
    c.graph.destroy()
  }

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

  let graph = []
  const dataset = utils.groupBy(results, c.sort)
  const labels = dataset[Object.keys(dataset)[0]].map(item => item[c.labels.time])

  labels.forEach((item, count) => {
    labels[count] = new Date(item).toLocaleString('en-GB', {timeZone: 'UTC'}).split(' ')[1]
  })

  let min = 0
  let max = 0
  Object.keys(dataset).forEach(item => {
    let obj = []
    const color = c.context.colors[item]
    Object.values(dataset[item]).forEach(subItem => {
      let fixed = subItem[c.labels.value].toFixed(5)
      let minTmp = Math.min(fixed)
      let maxTmp = Math.max(fixed)
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