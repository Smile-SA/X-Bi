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
            <a >
                <a href="#" @click="logoutUser()" class="export-button">Logout</a>
                <!-- <button class="button2" type="button">Logout</button> -->
            </a>
        </div>
    </div>
</template>

<script>
import { generateAPIUrl } from '../variables'

const api = generateAPIUrl()

export default {
    name: 'Profile',
    props: ['email', 'image'],
    watch: {},
    data() {
        return {
            tenant: ''
        }
    },
    created() {
        fetch(`${api}/current`, {credentials: 'include'})
        .then(response => response.json())
        .then(r => this.tenant = r.results)
    },
    methods: {
        logoutUser() {
            fetch(`${api}/logout`, {credentials: 'include', method: 'POST'})
        }
    }
}
</script>

<style>
</style>