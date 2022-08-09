import * as configurationsController from "../../../controller/configurationsController";
import * as utils from "../../../settings/utils";
import ApexCharts from 'apexcharts';

export default {
    name: 'session-action',
    components: {},
    props: ['data', 'id'],
    data() {
        return {
            formOptions: {
                validateAfterChanged: true
            },
            structure : this.data.structureType,
            model: {},
            form: {},
            showForm: false,
            controls: {},
            isModalVisible: false,
            series: [],
        }
    },
    computed: {},
    mounted() {

    },
    beforeMount() {
        this.getControls();
    },
    methods: {
        getControls() {
            this.controls = configurationsController.getControls()
        },
        async previewed(structureType) {
            let div = await document.createElement('div');
            div.id = 'update-' + structureType + '-form'
            let value = 0
            if (this.data.value != "") {
                value = this.data.value
            }
            await this.$swal({
                title: structureType + " preview",
                html: div,
                didOpen: () => {
                    this.series = [
                        {
                            name: 'series1',
                            data: []
                        },
                        {
                            name: 'series2',
                            data: []
                        }
                    ]
                    let options = utils.createOption(this.data)
                    options.series = this.series
                    options.chart.height = 400
                    let chart = new ApexCharts(div, options);
                    if (structureType === "chart") {
                        chart.render();
                        if (this.data.is_monitoring === true) {
                            this.series = []
                            setInterval(() => {
                                if (["polarArea", "radar", "radialBar", "donut"].includes(this.data.type)) {
                                    this.options = {
                                        chart: {
                                            type: this.data.type
                                        },
                                        labels: ["Team A", "Team B", "Team C", "Team D"],
                                    }
                                    chart.updateOptions(this.options)
                                    this.series.push(Math.floor(Math.random() * (37 - 30) + 30));
                                    chart.updateSeries(this.series)
                                } else {
                                    Object.keys(this.series).map((item) => {
                                        this.series[item].data.push([Date.now(), Math.floor(Math.random() * (37 - 30) + 30)])
                                    });
                                }
                                chart.updateSeries(this.series)
                            }, 1000);
                        } else {
                            if (["polarArea", "radar", "radialBar", "donut"].includes(this.data.type)) {
                                this.options = {
                                    chart: {
                                        type: this.data.type
                                    },
                                    labels: ["Team A", "Team B", "Team C", "Team D"],
                                }
                                chart.updateOptions(this.options)
                                chart.updateSeries([Math.floor(Math.random() * (37 - 30) + 30), Math.floor(Math.random() * (37 - 30) + 30), Math.floor(Math.random() * (37 - 30) + 30), Math.floor(Math.random() * (37 - 30) + 30)])
                            } else {
                                Object.keys(this.series).map((item) => {
                                    for (let step = 0; step <= 4; step++) {
                                        this.series[item].data.push([Date.now() - (step * 24 * 60 * 60 * 1000), Math.floor(Math.random() * (37 - 30) + 30)])
                                    }
                                });
                                chart.updateSeries(this.series)
                            }
                        }
                    } else {
                        if (structureType === "card") {
                            if (this.data.unit === undefined) {
                                this.data.unit = ''
                            }
                            div.innerHTML = '<div class="xbi">\n' +
                                '    <div class="xbi" @click="navigate" @keypress.enter="navigate" role="link">\n' +
                                '        <div class="display-flex xbi-card pointer p-3 bg-gradient-' + this.data.color + '">\n' +
                                '            <div class="card-content">\n' +
                                '                <div class="icon-card text-center border-radius-md center">\n' +
                                '                    <i style="font-size: 3rem;" class="h-100 fas fa fa-angle-right ' + this.data.icon + '"></i>\n' +
                                '                </div>\n' +
                                '            </div>\n' +
                                '            <div class="text-content">\n' +
                                '                <div class="display-block ' + this.data.type + '">\n' +
                                '                    <div class="text-end mb-0 pb-0">\n' +
                                '                    <span>\n' +
                                '                        <span class="value h2">' + value + '</span>\n' +
                                '                        <span v-if=" configuration.unit!=null || this.data.unit!=undefined || this.data.unit!=\'\'"\n' +
                                '                              class="unit"> ' + this.data.unit + '</span>\n' +
                                '                    </span>\n' +
                                '                        <br class="p-0 m-0" v-if="configuration.type!=\'multi-icon\'">\n' +
                                '                        <span class=" text-capitalize label h5"> ' + this.data.title + '</span>\n' +
                                '                    </div>\n' +
                                '                </div>\n' +
                                '            </div>\n' +
                                '        </div>\n' +
                                '    </div>\n';
                        }
                    }
                },
                showCancelButton: false,
                showConfirmButton: false,
                showLoaderOnConfirm: true,
                showCloseButton: true,
                // eslint-disable-next-line no-unused-vars
            }).then((result) => {
            });
        },
    }
}


