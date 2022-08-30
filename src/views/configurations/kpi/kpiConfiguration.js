import action from "../../../components/action/urlAction";
import * as general from "../../../controller/genaralController";
import addForm from "../../../components/forms/url/add";

export default {
  name: 'kpi-configuration',
  components: {addForm},
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
      this.list = [];
      general.get(this.$route.meta.crud.list.url).then((r) => {
        this.nb = r.total;
        Object.keys(r.results).map((item) => {
          let data= {
            'deleteTagIndex': 3,
            'colspan': 2
          }
          this.columns = []
          if(this.$route.meta.crud.list.id!==null && this.$route.meta.crud.list.id!=='' && this.$route.meta.crud.list.id!==undefined) {
            data['id']= r.results[item][this.$route.meta.crud.list.id].replace(this.$route.meta.crud.list.replace, '')
            Object.keys(r.results[item]).map((subItem) => {
              data[subItem] = r.results[item][subItem]
              if(subItem!=='is_default'){
                this.columns.push({
                  key: subItem,
                  title: subItem.replaceAll('-',' ').replaceAll('_',' ')
                })
              }
            });
            data['refreshFunction']=this.getList;
          }else{
            data['id']= r.results[item].replace(this.$route.meta.crud.list.replace, '');
            data['name']= r.results[item].replace(this.$route.meta.crud.list.replace, '');
            data['refreshFunction']=this.getList;
            this.columns.push({
              key: 'name',
              title: 'name'
            })
          }
          this.columns.push({
            key: "Actions",
            component: action
          })
          this.list.push(data)
        });
      });
    },
  },
  async beforeMount() {
    general.titleBoxRender(this)
    this.getList();
  },
  watch: {
    $route() {
      general.titleBoxRender(this)
      this.getList();
    }
  },
}



