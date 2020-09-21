<template>
    <div>
        <p class="text-center">
            <strong v-if='this.dataS.length > 0'>{{configuration.labels.title}}</strong>
        </p>
        <canvas class="pointer" @contextmenu.prevent="$refs.menu.open" @click.right="clicked" :id="idL" :height="height" :titre=dataS.toString()></canvas>
    </div>
</template>

<script>
    import Chart from "chart.js";

    export default {
        name: "BaseChart",
        props: ['idL', 'height', 'configuration', 'dataS'],
        data() {
            return {
                chart: null,
                currentData: {total: 0, results: []}
            }
        },
        async mounted() {
            this.drawChart(this.configuration);
        },
        beforeUpdate() {
            this.drawChart(this.configuration);
        },
        watch: {
            currentData: (n) => {
                return n;
            }
        },
        methods: {
            clicked(data) {
                this.selected = data.target.id
            },
            // eslint-disable-next-line no-unused-vars
            graphConfiguration(response, c) {},
            drawChart(c) {
                this.dataS.then((d => {
                    if (!!this.chart) {
                        this.chart.destroy()
                    }

                    this.currentData = d;
                    if (this.currentData.total === 0) {
                        return this.chart
                    }
                    const {ctx, config} = this.graphConfiguration(this.currentData.results, c)

                    this.chart = new Chart(ctx, config)
                }).bind(this));
            }
        }
    }
</script>

<style scoped>

</style>