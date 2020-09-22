<template>
  <div :class="['wrapper', classes]">
    <header class="main-header">
	<span class="logo-mini">
		<a href="/" class="logo">
      <img src="static/img/5GBiller_-_logo_7_.png" alt="Logo">
    </a>
	</span>
      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <!--
        <a href="javascript:;" class="sidebar-toggle fa fa-bars" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        -->
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <sidebar style="text-centered" :display-name="compDisplayName" :email="compEmail" />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name.toUpperCase() }}
          <small>{{ $route.meta.description }}</small>
        </h1>
        <ol class="breadcrumb">
          <li>
            <a href="/">
              <i class="fa fa-home"></i>Home</a>
          </li>
          <li class="active">{{$route.name.toUpperCase()}}</li>
        </ol>

      </section>

      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->

    <!-- Main Footer -->
    <footer class="main-footer">
      <strong>Copyright &copy; <a href="https://www.alterway.fr/">Alter Way</a>.</strong> All rights reserved.
    </footer>
  </div>
  <!-- ./wrapper -->
</template>

<script>
import { generateAPIUrl } from '../variables'
import * as utils from  '../utils'


const api = generateAPIUrl()

export default {
  name: 'Dash',
  components: {
    Sidebar: () => import('./partials/Sidebar')
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
    compEmail: function() {
      return this.$route.matched[0] && this.$route.matched[0].meta.email ? this.$route.matched[0].meta.email : this.email;
    }
  },
  methods: {
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
    },
    async getTenant () {
      const url = `${api}/current`
      this.user = await utils.fetchData(url, this)
    }
  },
  mounted () {
    this.getTenant()
  }
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}

.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.main-header .logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;

  img {
    display: block;
    height: auto;
    max-height: 100%;
    width: auto;
    max-width: 100%;
  }
}

.user-panel {
  height: 5em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}

.main-header .sidebar-toggle {
  line-height: inherit;
}
.button {
    position: absolute;
    top: 90%;
    left: 91%;
 
}
.button2 {
    position: absolute;
    top: 90%;
    left: 94.2%;
 
}
</style>
