<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <Profile :tenant= getTenant() :email=email :image=this.fakeImage()></Profile>
      <SidebarMenu/>
    </section>
  </aside>
</template>
<script>

import { generateAPIUrl } from '../../variables'
import * as utils from  '../../utils'

const api = generateAPIUrl()
export default {
  name: 'Sidebar',
  props: ['displayName', 'pictureUrl', 'email'],
  components: {
    Profile: () => import ('../Profile'),
    SidebarMenu: () => import('./SidebarMenu'),
  },
  mounted: function() {
    window
      .jQuery('[data-toggle="hideseek"]')
  },
  methods: {
     getTenant () {
      const url = `${api}/current`
      this.user =  utils.fetchData(url, this)
    },
     
    getEmail() {
      return 'rnd@alterway.fr'
    },
    fakeImage() {
      return 'https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip'
    }
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
