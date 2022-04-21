import * as configurationsController from "../../../controller/configurationsController.js"
import {generateAPIUrl} from "../../../settings/variables";
export default {
  name: 'menu-layout',
  components: {},
  props: [],
  data () {
    return {
      tenant: window.sessionStorage.getItem('tenant'),
      image: 'https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip',
      email: 'rnd@alterway.fr',
      api: generateAPIUrl(),
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
      this.menus = configurationsController.getMenus();
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


