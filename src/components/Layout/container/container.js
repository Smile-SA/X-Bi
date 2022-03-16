import * as utils from '../../../settings/utils'

export default {
  name: 'container',
  components: {
    SideMenu: () => import('../menu/index.vue'),
    HeaderLayout: () => import('../header/index.vue')
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
      this.user = await utils.fetchData(url)
    },
    editTitleBox() {
      setTimeout(() => {
        if ($( '#title-box' ).hasClass('col-md-2')) {
          $( '#title-box .apex-box .page-title .title').hide()
          $( '#title-box' ).removeClass( 'col-md-2');
          $( '#title-box').addClass( 'col-xxl-05 col-md-1 col-sm-2');
          $( '#title-box .apex-box .page-title .page-title-icon').removeClass('me-2')
          $( '#title-box .apex-box').addClass('text-center')
        }
        if ($( '#input-box' ).hasClass('col-md-10')) {
          $( '#input-box' ).removeClass( 'col-md-10');
          $( '#input-box').addClass( 'col-xxl-11-5 col-md-11 col-sm-10');
        }
      }, 4000);
    },
  },
  mounted() {
    this.getTenant();
    this.editTitleBox();
  }
}