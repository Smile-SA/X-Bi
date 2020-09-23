<template>
    <div class="user-panel">
        <div class="pull-left image">
          <img :src="image" />
        </div>
        <div class="pull-left info">
            <div>
                <p class="white">{{ tenant }}</p>
            </div>
            <span class="text-muted">{{ email }}</span>
         
                 <form v-if='this.tenant !== "Default"' method="POST" v-bind:action='this.logout_user()'>
                <input type="hidden">
                <button class="button2" type="submit">Logout</button>
                </form>

        </div>
    </div>
</template>

<script>
import { generateAPIUrl } from '../variables'
export default {
    name: 'Profile',
    props: ['email', 'tenant', 'image'],
    watch: {},
    data() {
       return {
         api: generateAPIUrl()
    }
    },
    created() {},
    methods: { 
    logout_user: function() {
     return(`${this.api}/logout`)
    },
    }
}
</script>

<style>
</style>