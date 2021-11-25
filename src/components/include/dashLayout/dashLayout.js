import {generateAPIUrl} from '../../../variables'
import * as utils from '../../../utils'
const api = generateAPIUrl()

export default {
  name: 'Dash',
  components: {
    Sidebar: () => import('./../sideBar/index.vue'),
    Header: () => import('./../header/index.vue')
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
      const url = `${api}/current`
      this.user = await utils.fetchData(url, this)
    }
  },
  mounted() {
    this.getTenant()
  }
}