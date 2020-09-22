<template>
    <div class="col-md-4 col-sm-6 col-xs-12 column">
        <div v-bind:class="'info-box bg-' + configuration.color">
            <span class="info-box-icon"><svg v-bind:class="configuration.icon"></svg></span>
            <div style="text-align: center;" class="info-box-content" @click="redirectCard()">
                <div style="text-align: center;">
                    <p></p>
                    <span class="info-box-text">{{configuration.label}}</span>
                    <span class="info-box-number">{{this.value}}</span>
                    <!-- <span v-if="this.fixedValue !== undefined" class="info-box-number">{{this.fixedValue}}</span> -->
                    <span v-if="this.configuration.message !== undefined" class="info-box-number-rating">{{this.configuration.message}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import * as utils from  '../utils'

    export default {
        name: "Card",
        props: {
            configuration: Object,
            url: String,
            fixedValue: String
        },
        watch: {
            url() {
                this.fetchNumber()
            }
        },
        data() {
            return {
                timer: '',
                value: 0
            }
        },
        created () {
            let choosen
            switch (this.configuration.type) {
                case "number": choosen = this.fetchNumber; break;
                case "string": choosen = this.fetchString; break;
                case "sum": choosen = this.fetchSum; break;
            }
            choosen()
            this.timer = setInterval(choosen, 10000)
        },
        methods: {
            fetchNumber() {
                const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
                fetch(this.url + queryDate, {credentials: 'include'})
                .then(response => response.json()
                .then(r => this.value = r.total))
                this.$forceUpdate()
            },
            fetchString() {
                const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
                fetch(this.url + queryDate, {credentials: 'include'})
                .then(response => response.json())
                .then(r => this.value = r.results[0][this.configuration.key])
                this.$forceUpdate()
            },
            fetchSum() {
                const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
                fetch(this.url + queryDate, {credentials: 'include'})
                .then(response => response.json())
                .then(r => this.value = r.results.map(item => item.frame_price).reduce((a, b) => a + b, 0).toFixed(5))
            },
            redirectCard() {
                if (this.configuration.link !== '/') {
                    this.$router.push(this.configuration.link);
                }
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<style>

    .slice-icon {
        background-image: url('../../public/static/img/5GBiller_-__Slices_-_logo_-_whiteV2.svg');
        background-repeat: no-repeat;
        border-top-left-radius: 2px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 2px;
        width: 45px;
        font-size: 45px;
        text-align: center;
    }
</style>