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
            <a v-if='this.tenant !== "Default"' href="http://localhost:5012/logout">
                <button class="button2" type="button">Logout</button>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    props: ['email', 'tenant', 'image'],
    watch: {},
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

<style>
</style>