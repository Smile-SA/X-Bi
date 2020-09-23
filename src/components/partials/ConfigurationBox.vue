<template>
    <div>
        <h4>Select {{ name }}</h4>
        <select class="form-control" v-on:change="listConfiguration">
          <option selected disabled> -- Select {{ name }} -- </option>
          <option v-for="config in list" v-bind:value="config" v-bind:key="config">{{config}}</option>
        </select>
        <div>
            <a href="#" @click="newConfiguration()" class="export-button">Create</a>
        </div>
        <div>
            <a href="#" @click="editConfiguration()" class="export-button">Update</a>
        </div>
        <div>
            <a href="#" @click="deleteConfiguration()" class="export-button">Delete</a>
        </div>
        <div class="input-area" v-if="showYaml()">
        <code class="lang-yaml">
            <pre contenteditable required>
{{ content }}
            </pre>
        </code>
    </div>
</template>

<script>
// import * as utils from  '../utils'

export default {
    name: 'ConfigurationBox',
    props: {
        configuration: Object,
        name: String
    },
    watch: {},
    data() {
        return {
            list: [],
            new: '',
            edit: '',
            delete: '',
            callback: null,
            content: '',
            active: '',
        }
    },
    created() {},
    methods: {
        showYaml() {
            return this.active !== ''
        },
        listConfiguration(configuration) {
            if (configuration !== undefined) {
                this.active = 
            }
        },
        newConfiguration() {},
        editConfiguration() {},
        deleteConfiguration() {},
    }
}
</script>

<style>
</style>