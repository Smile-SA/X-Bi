<template>
    <div class="col-md-4 col-sm-6 col-xs-12 column">
        <div v-bind:class="'info-box bg-' + card.color">
            <span class="info-box-icon"><svg v-bind:class="card.icon"></svg></span>
            <div style="text-align: center;" class="info-box-content" @click="redirectCard(card)">
                <div style="text-align: center;">
                    <p></p>
                    <span class="info-box-text">{{card.label}}</span>
                    <span class="info-box-number">{{this.value}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import * as utils from  '../utils'

    // class CardModel {
    //     public label: String;
    //     public value: Number;
    //     public color: String;
    //     public icon: String;
    //     public link: String;
    // }
    export default {
        name: "Card",
        props: {
            card: Object
        },
        data() {
            return {
                value: 0
            }
        },
        created () {
            this.fetchValue()
        },
        methods: {
            fetchValue() {
                const queryDate = utils.convertURLDateParameter(this.card.from, this.card.to)
                fetch(this.card.url + queryDate, {credentials: 'include'})
                .then(response => {
                    response.json().then(r => {
                        this.value = r.total
                    }
                )})
                this.value = this.card.value
                this.$forceUpdate()
            },
            redirectCard(card) {
                if (card.link !== '/') {
                    this.$router.push(card.link);
                }
            }
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