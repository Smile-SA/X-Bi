import action from "../../components/action/urlAction";
import * as general from "../../controller/genaralController";

export default {
  name: 'dynamic-configurations',
  components: {},
  props: [],
  data () {
    return {
      hover: true,
      list: [],
      columns:[],
      nb: 0,
    }
  },
  computed: {
    bindings() {
      return {
        data: this.list,
        showDownloadButton: false,
        columns: this.columns
      }
    }
  },
  methods: {
    getList() {
      general.get(this.$route.meta.crud.list.url).then((data) => {
        this.nb = data.total;
        Object.keys(data.results).map((item) => {
          let dat = {
            'deleteTagIndex': 3,
            'colspan': 2
          }
          this.columns = []
          if(this.$route.meta.crud.list.id!==null && this.$route.meta.crud.list.id!=='' && this.$route.meta.crud.list.id!==undefined) {
            dat['id']= data.results[item][this.$route.meta.crud.list.id].replace(this.$route.meta.crud.list.replace, '')
            Object.keys(data.results[item]).map((subItem) => {
              dat[subItem] = data.results[item][subItem]
              if(subItem!=='is_default'){
                this.columns.push({
                  key: subItem,
                  title: subItem.replaceAll('-',' ').replaceAll('_',' ')
                })
              }
            });
          }else{
            dat['id']= data.results[item].replace(this.$route.meta.crud.list.replace, '');
            dat['name']= data.results[item].replace(this.$route.meta.crud.list.replace, '');
            this.columns.push({
              key: 'name',
              title: 'name'
            })
          }
          this.columns.push({
            key: "Actions",
            component: action
          })
          this.list.push(dat)
        });
      });
    },
  },
  async beforeMount() {
    general.titleBoxRender(this)
    this.getList();
  }
}


