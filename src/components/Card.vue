<template>
    <div class="col-md-4 col-sm-6 col-xs-12 column">
        <div v-bind:class="'info-box bg-' + configuration.color">
            <span class="info-box-icon"><svg v-bind:class="configuration.icon"></svg></span>
            <div style="text-align: center;" class="info-box-content" @click="redirectCard()">
                <div style="text-align: center;">
                    <p></p>
                    <span class="info-box-text">{{configuration.label}}</span>
                    <span class="info-box-number">{{this.value}}</span>
                    <a></a>
                </div>
                <span v-if="this.configuration.message !== undefined" class="info-box-number-rating">{{this.configuration.message}}</span>
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
            url: String
        },
        watch: {
            url() {
                this.fetchNumber()
            }
        },
        data() {
            return {
                timer: '',
                value: '-'
            }
        },
        created () {
            let choosen
            switch (this.configuration.type) {
                case "number": choosen = this.fetchNumber; break;
                case "string": choosen = this.fetchString; break;
                case "sum": choosen = this.fetchSum; break;
                case "avg": choosen = this.fetchAverrage; break;
            }
            choosen()
            this.timer = setInterval(choosen, 15000)
        },
        methods: {
            cardFetch() {
                const queryDate = utils.convertURLDateParameter(this.configuration.from, this.configuration.to)
                return fetch(this.url + queryDate, {credentials: 'include'}).then(response => response.json())
            },
            fetchNumber() {
                this.cardFetch().then(r => this.value = r.total)
                this.$forceUpdate()
            },
            fetchString() {
                this.cardFetch().then(r => this.value = r.results[0][this.configuration.key])
                this.$forceUpdate()
            },
            fetchSum() {
                this.cardFetch().then(r => {
                    this.value = (r.results.length === 1) ?
                     r.results[0][this.configuration.key].toFixed(2) : 
                     r.results.map(item => item[this.configuration.key]).reduce((a, b) => a + b, 0).toFixed(2)
                    this.$forceUpdate()
                })
            },
            fetchAverrage() {
                this.cardFetch().then(r => {
                    this.value = (r.results.map(item => item[this.configuration.key])
                                          .reduce((a, b) => a + b) / r.results.length)
                                          .toFixed(2)
                    this.$forceUpdate()
                })
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