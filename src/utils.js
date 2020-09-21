import { generateAPIUrl } from './variables'


export function convertURLDateParameter(from, to) {
  from = (from !== null) ? from : new Date(new Date().setHours(new Date().getHours() - 1)).toISOString()
  to = (to !== null) ? to : new Date().toISOString()
  from = from.replace('T', ' ')
  to = to.replace('T', ' ')
  return `?start=${from}&end=${to}`
}

export function JSONToCSV(json) {
  const replacer = (key, value) => value === null ? '' : value
  const header = Object.keys(json[0])
  let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  csv.unshift(header.join(','))
  return csv.join('\r\n')
}

export async function fetchTotal(url, that) {
  const queryDate = convertURLDateParameter(that.from, that.to)
  url = url + queryDate
  try {
    const response = await fetch(url, {
      credentials: 'include'
    })
    const json = await response.json()
    return json.total
  }
  catch (error) {
    return 0
  }
}

export async function fetchData(url, that) {
  const queryDate = convertURLDateParameter(that.from, that.to)
  url = url + queryDate
  const response = await fetch(url, {
    credentials: 'include'
  })
  const json = await response.json()
  return json.results
}

export async function fetchDataAsJSON(url, that) {
  const queryDate = convertURLDateParameter(that.from, that.to)

  url = url + queryDate
  const response = await fetch(url, {
    credentials: 'include'
  })
  const json = await response.json()
  if (json.total === 0) {
    return {total: 0, results: null}
  }
  return {total: json.total, results: json.results}
}

export async function downloadFile(url, filename, type) {
  const response = await fetch(url, {
    credentials: 'include'
  })
  const json = await response.json()
  let content
  let mime
  if (type === 'JSON') {
    content = await JSON.stringify(json.results)
    mime = 'text/json'
  } else if (type === 'CSV') {
    content = JSONToCSV(json.results)
    mime = 'text/csv'
  }

  const el = document.createElement('a')
  el.setAttribute('href', `data:${mime};charset=utf-8,` + encodeURIComponent(content))
  el.setAttribute('download', filename)
  el.style.display = 'none'
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

export function getPeriod(url) {
  let broken = url.split('?')[1].split('&')
  const from = broken[0].split('=')[1].replace(' ', 'T')
  const to = broken[1].split('=')[1].replace(' ', 'T')
  return `_${from}-${to}`
}


export async function generateColor(source, that) {
  const colors = {}
  for (const obj of source) {
    (await fetchData(`${obj.endpoint}`, that)).forEach(item => colors[item[obj.key]] = getRandomColor())
  }
  return colors
}


export function getRandomColor() {
  const chartColors = [
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

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function groupBy(objectArray, property) {
  return objectArray.reduce(function(acc, obj) {
    const key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

export function getURL(data, that) {
  const option = data.target.innerText
  const url = that.queryArray[that.selected]
  const filename = that.selected + getPeriod(url) + '.' + option.toLowerCase()
  downloadFile(url, filename, option)
}

export async function refreshDate(date, that) {
  if (date !== null) {
    that.from = date.start.toISOString().split('.')[0] + '.000Z'
    if (date.end === null || date.start === date.end) {
      date.end = new Date(that.from)
      date.end.setDate(date.end.getDate() + 1)
    }
    that.to = date.end.toISOString().split('.')[0] + '.000Z'
    that.to = that.to.replace('T', ' ')
    that.from = that.from.replace('T', ' ')
  }
  that.cards = []
  if (that.drawCards) {
   await that.drawCards()
  }
  if (that.drawGraphs) {
    await that.drawGraphs()
  }

}

export async function isAuth() {
    const api = generateAPIUrl()
    const url = `${api}/current`
    const response = await fetch(url)
    const json = await response.json()
    return json.results !== 'Default'
}