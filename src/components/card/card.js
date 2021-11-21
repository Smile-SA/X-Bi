import * as utils from  '../../utils'

export default {
  name: "Card",
  props: {
    configuration: Object,
    url: String,
  },
  watch: {
    url() {
      this.fetchNumber()
    }
  },
  data() {
    return {
      timer: '',
      value: '-'
    }
  },
  created () {
    let choosen
      switch (this.configuration.type) {
        case "number": choosen = this.fetchNumber; break;
        case "string": choosen = this.fetchString; break;
        case "sum": choosen = this.fetchSum; break;
        case "avg": choosen = this.fetchAverrage; break;
      }
    choosen()
    this.timer = setInterval(choosen, 15000)
  },
  methods: {
    cardFetch() {
      const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
      return fetch(this.url + queryDate, {credentials: 'include'}).then(response => response.json())
    },
    fetchNumber() {
      this.cardFetch().then(r => this.value = r.total)
      this.$forceUpdate()
    },
    fetchString() {
      this.cardFetch().then(r => this.value = r.results[0][this.configuration.key])
      this.$forceUpdate()
    },
    fetchSum() {
      this.cardFetch().then(r => {
        this.value = (r.results.length === 1) ?
            r.results[0][this.configuration.key].toFixed(2) :
            r.results.map(item => item[this.configuration.key]).reduce((a, b) => a + b, 0).toFixed(2)
        this.$forceUpdate()
      })
    },
    fetchAverrage() {
      this.cardFetch().then(r => {
        this.value = (r.results.map(item => item[this.configuration.key])
            .reduce((a, b) => a + b) / r.results.length)
            .toFixed(2)
        this.$forceUpdate()
      })
    },
    redirectCard() {
      if (this.configuration.link !== '/') {
        this.$router.push(this.configuration.link);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}