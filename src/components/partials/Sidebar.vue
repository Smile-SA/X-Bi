<template>
  <aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

      <!-- Sidebar user panel (optional) -->
      <div class="user-panel">
        <div class="pull-left image">
          <img :src="pictureUrl" />
        </div>
        <contact-label :display-name="'Admin'" :email="'rnd@alterway.fr'"/>
      </div>

      <!-- Sidebar Menu -->
      <sidebar-menu />
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>
<script>

export default {
  name: 'Sidebar',
  props: ['displayName', 'pictureUrl', 'email'],
  components: {
    SidebarMenu: () => import('./SidebarMenu'),
    ContactLabel:  () => import('./ContactLabel')
  },
  mounted: function() {
    window
      .jQuery('[data-toggle="hideseek"]')
  }
}
</script>
<style scope="local">
.user-panel .image img {
  border-radius: 50%;
}
#searchForm {
  padding-left: 0em;
  padding-right: 0em;
}
#searchContainer {
  height: 100%;
  padding-bottom: 0em;
}
#search {
  width: 80%;
  float: right;
}

#search-btn {
  width: 20%;
}
</style>
