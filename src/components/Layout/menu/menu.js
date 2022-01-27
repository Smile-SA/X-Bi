import * as controller from "../../../controller/routerController.js"
export default {
  name: 'menu-layout',
  components: {},
  props: [],
  data () {
    return {
      isActive : {},
      show : {},
      menus: null,
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    getMenus(){
      this.menus = controller.getMenus();
    },
    async sunMenu(){
      let a = {},s={};
      await Object.keys(this.menus).map((item) => {
        if(this.menus[item].children){
          a[this.menus[item].id]=false;
          s[this.menus[item].id]=[]
          Object.keys(this.menus[item].children).map((subItem) => {
             s[this.menus[item].id].push(this.menus[item].children[subItem].name);
          });
        }
      });
      this.isActive = a;
      this.show = s;
    }
  },
  async beforeMount() {
    await this.getMenus();
    await this.sunMenu();
  }
}


