import $ from 'jquery';
import {logOut} from "../../../controller/authController";
export default {
  name: 'header-layout',
  props: ['user'],
  components: {},
  data() {
    return {
      drop : false
    }
  },
  created() {

  },
  computed: {

  },
  mounted() {

  },
  methods: {
    dropDownEvent(){
      if(this.drop===true)
        this.drop = false
      else  this.drop = true
    },
    logoutUser() {
      logOut();
    },
    reduceMenu(){
      if ($( "body" ).hasClass('sidebar-icon-only')) {
        $( "body" ).removeClass( 'sidebar-icon-only');
      } else {
        $( "body" ).addClass( 'sidebar-icon-only');
      }
    },
    showMenu(){
      if ($( ".sidebar.sidebar-offcanvas" ).hasClass('active')) {
        $( ".sidebar.sidebar-offcanvas" ).removeClass( 'active');
      } else {
        $( ".sidebar.sidebar-offcanvas" ).addClass( 'active');
      }
    }
  }
}


