<template>
  <ul class="sidebar-menu">
    <li class="header">MENU</li>
    <router-link tag="li" class="pageLink" to="/">
      <a>
        <i class="fa fa-columns"></i>
        <span class="pages">Overall</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/namespaces">
      <a>
        <i class="fa fa-sitemap"></i>
        <span class="pages">Namespaces</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/nodes">
      <a>
        <i class="fa fa-desktop"></i>
        <span class="pages">Nodes</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/pods">
      <a>
        <i class="fa fa-sitemap"></i>
        <span class="pages">Pods</span>
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
