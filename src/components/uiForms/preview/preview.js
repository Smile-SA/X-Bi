import * as configurationsController from "../../../controller/configurationsController";
import * as chartController from "../../../controller/chartController";

import VueApexCharts from 'vue-apexcharts'

export default {
    name: 'preview',
    components: {apexcharts: VueApexCharts,},
    props: ['modelId', 'structureType', 'refreshFunction', 'viewId'],
    data() {
        return {
            model: {},
            options: {},
            shows: {
                chart: false,
                card: false,
            }
        }
    },
    computed: {},
    beforeMount() {

    },
    methods: {
        async show() {
            await this.getModel();
            await this.$modal.show('preview-modal-' + this.structureType + this.modelId);
            if (this.structureType === 'chart') {
                this.drawChart();
            } else {
                this.shows.card = true;
            }
        },
        hide() {
            this.$modal.hide('preview-modal-' + this.structureType + this.modelId);
        },

        getModel() {
            let data = configurationsController.getModel(this.structureType, this.viewId, this.modelId);
            if (Object.keys(data).length > 0) {
                this.model = data;
            }
        },
        drawChart() {
            this.shows.chart = true;
            this.options = chartController.createOption(this.model)
            this.options.series = [
                {
                    name: 'series1',
                    data: []
                },
                {
                    name: 'series2',
                    data: []
                }
            ]
            this.options.chart.height = 400
            if (this.model.is_monitoring === true) {
                let series = []
                if (["polarArea", "radar", "radialBar", "donut"].includes(this.model.type)) {
                    console.log('ici')
                    this.options = {
                        chart: {
                            type: this.model.type
                        },
                        labels: ["Team A", "Team B", "Team C", "Team D"],
                    }
                    this.$refs['chart-' + this.structureType + this.modelId].updateOptions(this.options)
                    series.push(Math.floor(Math.random() * (37 - 30) + 30));
                    this.options.series = series;
                    this.$refs['chart-' + this.structureType + this.modelId].updateSeries(series)
                } else {
                    setInterval(async () => {
                        await Object.keys(this.options.series).map((item) => {
                            if (this.options.series[item].data.push([Date.now(), Math.floor(Math.random() * (37 - 30) + 30)])) {
                                this.$refs['chart-' + this.structureType + this.modelId].updateSeries(this.options.series)
                            }
                        });
                    }, 1000);

                }
            } else {
                if (["polarArea", "radar", "radialBar", "donut"].includes(this.model.type)) {
                    this.options = {
                        chart: {
                            type: this.model.type
                        },
                        labels: ["Team A", "Team B", "Team C", "Team D"],
                    }
                    this.options.series = [Math.floor(Math.random() * (37 - 30) + 30), Math.floor(Math.random() * (37 - 30) + 30), Math.floor(Math.random() * (37 - 30) + 30), Math.floor(Math.random() * (37 - 30) + 30)]
                } else {
                    Object.keys(this.options.series).map((item) => {
                        for (let step = 0; step <= 4; step++) {
                            this.options.series[item].data.push([Date.now() - (step * 24 * 60 * 60 * 1000), Math.floor(Math.random() * (37 - 30) + 30)])
                        }
                    });
                }
            }
            return true
        }
    }
}


