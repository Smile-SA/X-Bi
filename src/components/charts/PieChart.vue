<template>
    <div>
        <p class="text-center">
            <strong v-if='this.dataS.length > 0'>{{configuration.labels.title}}</strong>
        </p>
        <canvas class="pointer" :id="idL" :height="height" :titre=dataS.toString()></canvas>
    </div>
</template>

<script>
    import BaseChart from "./BaseChart";
    import * as utils from "../../utils";
    import Chart from "chart.js";

    export default {
        name: "BarChart",
        extends: BaseChart,
        props: ['idL', 'height', 'configuration', 'dataS'],
        methods: {
            graphConfiguration(response, c) {
                let dataset = utils.groupBy(response, c.sort)
                const labels = [...Object.keys(dataset)]
                const colors = [...Object.keys(dataset)].map((item) => c.colors[item])
                dataset = [...Object.values(dataset)].map((item) => item.length)

                const ctx = document.getElementById(c.id).getContext('2d')
                const config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: dataset,
                            backgroundColor: colors
                        }],
                        labels: labels
                    },
                    options: {
                        title: {
                            fontSize: 20,
                            display: true,
                            text: c.labels.title
                        },
                        responsive: true,
                        maintainAspectRatio: !c.isMobile,
                        legend: {
                            display: false
                        },
                        tooltips: {
                            intersect: false,
                            mode: 'label'
                        }
                    }
                }

                return new Chart(ctx, config)
            },
        }
    }
</script>