<template>
  <ul class="sidebar-menu">
    <li class="header">MENU</li>
    <router-link tag="li" class="pageLink" to="/home">
      <a>
        <i class="fa fa-columns"></i>
        <span class="pages">Overall</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/namespaces">
      <a>
        <svg class="slice-icon2 svg-inline--fa fa-w-32"></svg>
        <span class="pages">Slices</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/nodes">
      <a>
        <i class="fa fa-server"></i>
        <span class="pages">Nodes</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/pods">
      <a>
        <i class="fa fa-sitemap"></i>
        <span class="pages">Services</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/metrics">
      <a>
        <i class="fa fa-wrench"></i>
        <span class="pages">Metrics</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/metrics">
      <a>
        <i class="fa fa-diaspora"></i>
        <span class="pages">Metrics</span>
      </a>
    </router-link>
  </ul>
</template>
<script>
export default {
  name: 'SidebarMenu'
}
</script>
<style>
/* override default */
.sidebar-menu > li > a {
  padding: 12px 15px 12px 15px;
}

.slice-icon2 {
  background-image: url('../../../public/static/img/5G_Slices_-_logo_-_black_-_kube_only.svg');
  background-repeat: no-repeat;
  width: 16px;
  height: 16px;
  padding-right: 1px;
  float: left;
  text-align: left;
}
.sidebar-menu li.active > a > .fa-angle-left,
.sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {
  animation-name: rotate;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

.treeview-title {
  z-index: 1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-90deg);
  }
}
</style>
