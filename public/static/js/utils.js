export function convertURLDateParameter(from, to) {
  from = (from !== null) ? from : new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
  to = (to !== null) ? to : new Date().toISOString()
  from = from.replace('T', ' ')
  to = to.replace('T', ' ')
  return `?start=${from}&end=${to}`
}
  
export function clicked(data) {
  this.selected = data.target.id
}

export function JSONToCSV(json) {
  const replacer = (key, value) => value === null ? '' : value
  const header = Object.keys(json[0])
  let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  csv.unshift(header.join(','))
  return csv.join('\r\n')
}

export async function fetchTotal(url, that) {
  let queryDate = convertURLDateParameter(that.from, that.to)
  url = url + queryDate
  const response = await fetch(url, {})
  const json = await response.json()
  return json.total
}

export async function fetchData(url) {
  let queryDate = convertURLDateParameter()
  url = url + queryDate
  const response = await fetch(url, {})
  const json = await response.json()
  return json.results
}

export async function fetchDataAsJSON(url, that) {
  let queryDate = convertURLDateParameter(that.from, that.to)

  url = url + queryDate
  const response = await fetch(url, {})
  const json = await response.json()
  if (json.total === 0) {
    return {total: 0, results: null}
  }
  return {total: json.total, results: json.results}
}

export async function downloadFile(url, filename, type) {
  const response = await fetch(url, {})
  const json = await response.json()
  let content
  let mime
  if (type === 'JSON') {
    content = await JSON.stringify(json.results)
    mime = 'application/json'
  } else if (type === 'CSV') {
    content = JSONToCSV(json.results)
    mime = 'text/csv'
  }
  require('downloadjs')(content, filename, mime)
}

export function getPeriod(url) {
  let broken = url.split('?')[1].split('&')
  let from = broken[0].split('=')[1]
  let to = broken[1].split('=')[1]
  return `_${from}-${to}`
}

export function getRandomColor() {
  var chartColors = [
    '#001f3f',
    '#10375E',
    '#173A5E',
    '#173D5E',
    '#164F87',
    '#32415c',
    '#2C3C5B',
    '#4D6087',
    '#324C63',
    '#4F6B84',
    '#3b898d',
    '#377275',
    '#2E5B50',
    '#265149',
    '#538389',
    '#2D5459',
    '#4b93b0',
    '#66A0B7',
    '#385C6B',
    '#1C4D60',
    '#1F4B6B',
    '#1F6B5E',
    '#d2d6de',
    '#b5bbc8',
    '#a70446',
    '#7C123D',
    '#960A42',
    '#77143C',
    '#771458',
    '#771914',
    '#701611',
    '#511714',
    '#93231D',
    '#6D1A42',
    '#490B29',
    '#842D57',
    '#84512D',
    '#7F441A',
    '#a83d48',
    '#8E3039',
    '#842932',
    '#601F26',
    '#CC7B41',
    '#9E511A',
    '#9E351A',
    '#c26929'
  ]
  return chartColors[Math.floor(Math.random() * chartColors.length)]
}

export function groupBy(objectArray, property) {
  return objectArray.reduce(function(acc, obj) {
    let key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
  
export function redirectCard(data) {
  if (data.link !== '/') {
    this.$router.push(data.link)
  }
  }