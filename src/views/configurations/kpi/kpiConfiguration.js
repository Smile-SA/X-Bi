import action from "../../../components/action/urlAction";
import * as general from "../../../controller/generalController";
import addForm from "../../../components/forms/url/add";
import axios from "axios";

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
    async getList() {
      this.list = [];
      const localStorageList = localStorage.getItem(`x-bi:${this.$route.name}-list`);
      const r = localStorageList ? JSON.parse(localStorageList) : await general.get(this.$route.meta.crud.list.url);
      localStorage.setItem(`x-bi:${this.$route.name}-list`, JSON.stringify(r));
      
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

    },


    async itemAddedHandler(item) {
      item.name = "rating-rule-template-" + item.query_name;
      let tempData;
      if (this.$route.name.toLowerCase() === 'templates') {
        tempData = {
          "data": {
              "results": {
                  "apiVersion": "rating.smile.fr/v1",
                  "kind": "RatingRuleTemplate",
                  "metadata": {
                    "name": "rating-rule-template-" + item.query_name,
                    "namespace": "rating"
                  },
                  "spec": {
                    "query_name": item.query_name,
                    "query_group": item.query_group,
                    "query_template": item.query_template
                  }
                },
              "total": 1,
              "errors": false
          }
        };
      }
      else if (this.$route.name.toLowerCase() === 'instances') {
        const template = await axios.get(`/X-Bi/mockData/templates/get/${item.template_name}.json`);
        tempData = {
          "data": {
            "results": {
                "apiVersion": "rating.smile.fr/v1",
                "kind": "RatingRuleInstance",
                "metadata": {
                    "annotations": {
                        "meta.helm.sh/release-name": "rating",
                        "meta.helm.sh/release-namespace": "rating"
                    },
                    "creationTimestamp": new Date(),
                    "generation": 1,
                    "labels": {
                        "app.kubernetes.io/managed-by": "Helm"
                    },
                    "managedFields": [
                        {
                            "apiVersion": "rating.smile.fr/v1",
                            "fieldsType": "FieldsV1",
                            "fieldsV1": {
                                "f:metadata": {
                                    "f:annotations": {
                                        ".": {},
                                        "f:meta.helm.sh/release-name": {},
                                        "f:meta.helm.sh/release-namespace": {}
                                    },
                                    "f:labels": {
                                        ".": {},
                                        "f:app.kubernetes.io/managed-by": {}
                                    },
                                    "f:ownerReferences": {
                                        ".": {},
                                        "k:{\"uid\":\"44c38877-bfca-4310-8c0b-8ea24946871e\"}": {}
                                    }
                                },
                                "f:spec": {
                                    ".": {},
                                    "f:metric": {},
                                    "f:name": {},
                                    "f:timeframe": {}
                                }
                            },
                            "manager": "Go-http-client",
                            "operation": "Update",
                            "time": "2024-08-20T13:24:17Z"
                        }
                    ],
                    "name": `rating-rule-instance-${item.metric_name}`,
                    "namespace": "rating",
                    "ownerReferences": [
                        {
                            "apiVersion": "charts.helm.k8s.io/v1",
                            "blockOwnerDeletion": true,
                            "controller": true,
                            "kind": "Rating",
                            "name": "rating",
                            "uid": "44c38877-bfca-4310-8c0b-8ea24946871e"
                        }
                    ],
                    "resourceVersion": "2787",
                    "uid": "d8463449-257f-4e62-82dd-fc634744dca4"
                },
                "spec": {
                    "metric": template.data.results.query_template,
                    "name": item.metric_name,
                    "timeframe": item.timeframe
                }
            },
            "total": 1
          }
        };
      }
      const name = item.name.replace('template-undefined', 'instance-' + item.metric_name);
      const list = JSON.parse(localStorage.getItem(`x-bi:${this.$route.name}-list`));
      list.results.push(name);
      list.total = list.total + 1; 
      localStorage.setItem(`x-bi:${this.$route.name}-list`, JSON.stringify(list));

      localStorage.setItem('x-bi:' + name, JSON.stringify(tempData));
      await this.getList();
    }
  },
  async beforeMount() {
    general.titleBoxRender(this)
    await this.getList();
  },
  watch: {
    async $route() {
      general.titleBoxRender(this)
      await this.getList();
    }
  },
}



