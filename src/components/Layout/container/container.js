import * as utils from '../../../settings/utils'
import {getJsonData} from "../../../controller/genaralController";

export default {
  name: 'container',
  components: {
    SideMenu: () => import('../menu/index.vue'),
    HeaderLayout: () => import('../header/index.vue'),
    PageFooter: () => import('../pagefooter/index.vue')
  },
  props: ['displayName', 'email'],
  data: function () {
    return {
      to: new Date().toISOString(),
      from: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      user: 'Default',
      classes: {
        fixed_layout: false,
        hide_logo: false
      },
      error: '',
    }
  },
  computed: {
    compDisplayName: function () {
      return this.$route.matched[0] && this.$route.matched[0].name ? this.$route.matched[0].name : this.displayName;
    },
    compEmail: function () {
      return this.$route.matched[0] && this.$route.matched[0].meta.email ? this.$route.matched[0].meta.email : this.email;
    }
  },
  methods: {
    changeloading() {
      this.$store.commit('TOGGLE_SEARCHING')
    },
    async getTenant() {
      const url = `/current`
      this.user = await getJsonData(url)
    },

  },
  mounted() {
    this.getTenant();
  },
  updated(){
    this.$nextTick(()=>{
      utils.editTitleBox();
    })
  }
}