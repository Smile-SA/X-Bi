<template>
    <div v-bind:class="'info-box bg-' + card.color">
        <span class="info-box-icon"><i v-bind:class="card.icon"></i></span>
        <div style="text-align: center;" class="info-box-content" @click="redirectCard(card)">
            <div style="text-align: center;">
                <p></p>
                <span class="info-box-text">{{card.label}}</span>
                <span class="info-box-number">{{card.value}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    // class CardModel {
    //     public label: String;
    //     public value: Number;
    //     public color: String;
    //     public icon: String;
    //     public link: String;
    // }
    export default {
        name: "Card",
        props: {card: Object},
        created: function () {
            console.log(this.card);
            // => { message: "goodbye", foo: "abc", bar: "def" }
        },
        methods: {
            redirectCard() {
                consl
                if (this.card.link !== '/') {
                    this.$router.push(this.card.link);
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