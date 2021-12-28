import {getTemplates} from "../../../controller/templatesController";
import {goTo} from "../../../settings/utils";
import {addInstance} from "../../../controller/instancesController";
export default {
  name: 'create-instance',
  components: {
  },
  props: [],
  data() {
    return {
      errors: {},
      message: '',
      name: '',
      template: '',
      cpu: '',
      memory: '',
      price: '',
      timeframe: '',
      templatesList:[],
      templatesNb:0,
    }
  },
  computed: {

  },
  mounted() {

  },
  async beforeMount(){
    this.Templates();
  },
  methods: {
    Templates() {
      getTemplates().then((data) => {
        this.templatesNb = data.total;
        this.templatesList = data.results;
      });
    },
    resetForm() {
      this.errors = {};
      this.name = this.message =this.cpu = this.memory =this.price = this.timeframe = '';
    },
    submitForm(e) {
      e.preventDefault();
      this.message = ''
      this.errors = {};
      this.checkAll();
      if (Object.keys(this.errors).length === 0) {
        this.errors = {};
        addInstance(this.name, (this.template).replace('rating-rule-template-',''),this.cpu,this.memory,this.price,this.timeframe).then((r) => {
          if (r.errors) {
            this.errors.submit = true
          } else {
            this.resetForm();
            this.errors.submit = false
          }
          this.message = r.message
        });
      }
    },
    checkName() {
      if ((this.name).trim() === '') {
        this.errors.name = 'Instance name is required.';
      } else {
        delete this.errors.name;
      }
    },
    checkTemplate() {
      if ((this.template).trim() === '') {
        this.errors.template = 'Template is required.';
      } else {
        delete this.errors.template;
      }
    },
    checkCpu() {
      if ((this.cpu).trim() === '') {
        this.errors.cpu = 'CPU is required.';
      } else {
        delete this.errors.cpu;
      }
    },
    checkMemory() {
      if ((this.memory).trim() === '') {
        this.errors.memory = 'Memory is required.';
      } else {
        delete this.errors.memory;
      }
    },
    checkPrice() {
      if ((this.price).trim() === '') {
        this.errors.price = 'Price is required.';
      } else {
        delete this.errors.price;
      }
    },
    checkTimeframe() {
      if ((this.timeframe).trim() === '') {
        this.errors.timeframe = 'timeframe is required.';
      } else {
        delete this.errors.timeframe;
      }
    },
    checkAll(){
      this.checkName();
      this.checkTemplate();
      this.checkCpu();
      this.checkMemory();
      this.checkPrice();
      this.checkTimeframe();
    },
    go(route) {
      goTo(route,this)
    },
  }
}



