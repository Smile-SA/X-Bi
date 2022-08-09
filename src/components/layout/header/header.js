import $ from 'jquery';
import {logOut} from "../../../controller/authController";
export default {
  name: 'header-layout',
  components: {},
  data() {
    return {
      tenant: window.sessionStorage.getItem('tenant'),
      image: 'https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip',
      email: 'rnd@alterway.fr',
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


