<template>
    <div v-if='this.tenant !== ""' class="user-panel">
        <div class="pull-left image">
          <img :src="image" />
        </div>
        <div class="pull-left info">
            <div>
                <p class="white">{{ tenant }}</p>
            </div>
            <span class="text-muted">{{ email }}</span>
            <form method="POST" v-bind:action='this.logoutUser()'>
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
    props: ['email', 'image'],
    watch: {},
    data() {
        return {
            tenant: '',
            api: generateAPIUrl()
        }
    },
    created() {
        fetch(`${this.api}/current`, {credentials: 'include'})
        .then(response => response.json())
        .then(r => this.tenant = r.results)
    },
    methods: {
        logoutUser() {
            return(`${this.api}/logout`)
        },
    }
}
</script>

<style>
</style>