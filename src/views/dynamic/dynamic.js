import * as utils from '../../settings/utils'
import * as configurationsController from "../../controller/configurationsController";
import * as genaralController from "../../controller/genaralController";

export default {
  name: 'dynamic',
  components: {},
  data() {
    return {
      group: 'Hour',
      groupOptions: ['Hour', 'Day', 'Month', 'Year'],
      queryBegin: "",
      to: null,
      from: null,
      date: null,
      queryLink: '',
      active: null,
      dynamicData: [],
      select: {
        models: {},
        styles: {}
      },
      structure: {
        card: {
          models: {},
          styles: {}
        },
        chart: {
          models: {},
          styles: {}
        }

      }
    }
  },
  computed: {
    confChartNodesPods() {
      return {
        id: 'pieChartNodesPods',
        type: 'donut',
        height: 450,
        fontSize: '20px',
        sort: 'node',
        xaxis: {
          type: 'datetime'
        },
        labels: {
          time: 'frame_begin',
          value: 'frame_price',
          title: 'Services repartition by nodes'
        }
      }
    },
  },
  methods: {
    showDatePicker() {
      return this.active !== null
    },
    showGroup() {
      return this.active !== null && this.date !=null
    },
    async setDynamicDataSelect(input) {
      this.active = input.target.value;
      this.queryBegin = this.queryLink + '/' + this.active;
      this.setDate(this.date);
    },
    async setDate(date) {
      if (date) {
        this.date = date;
        await this.setModelsData();
        await utils.refreshDate(this.date, this);
      }
    },
    async setGroup(event) {
      this.group = event.target.value;
      this.setDate(this.date)
    },
    setModelsData() {
      this.structure.card = {
        models: {},
        styles: {}
      }
      this.structure.chart = {
        models: {},
        styles: {}
      }
    },
    getStructureModelsData() {
      let r = configurationsController.getSelectModels(this.$route.name)
      if (r.data.errors !== true) {
        if (r.data.total > 0) {
          this.select.models = r.data.results;
        }
      } else {
        this.select.models = {};
        this.select.styles = {};
      }
    },
    setDefaultDate(jour, month, year) {
      var e = new Date, n, a = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()));
      if (jour > 0) {
        n = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate() - jour))
      }
      if (month > 0) {
        n = new Date(Date.UTC(e.getFullYear(), e.getMonth() - month, e.getDate()))
      }
      if (year > 0) {
        n = new Date(Date.UTC(e.getFullYear() - year, e.getMonth(), e.getDate()))
      }
      return {start: n, end: a}
    },
    async getDynamicSelectData() {
      await this.getStructureModelsData();
      if (Object.keys(this.select.models).length > 0) {
        await Object.keys(this.select.models).map((key) => {
          if (this.select.models[key].type === 'dynamic') {
            this.queryLink = this.select.models[key].query;
            genaralController.getJsonData(this.select.models[key].query).then((r) => {
              if (r.total > 0) {
                this.dynamicData = r.results
              }
            })
          }
        })
      }
    }
  },
  async beforeMount() {
    await this.getDynamicSelectData();
  },
  async mounted() {
    if(this.$route.name === 'Overall'){
      this.date = this.setDefaultDate(1)
      this.setDate(this.date);
      this.active = 'active';
    }
  }
}


