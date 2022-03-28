import * as configurationsController from "../../../controller/configurationsController";
import * as utils from "../../../settings/utils";
import ApexCharts from 'apexcharts'

export default {
    name: 'session-action',
    components: {},
    props: ['data', 'id'],
    data() {
        return {
            formOptions: {
                validateAfterChanged: true
            },
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
    methods: {
        getControls() {
            this.controls = configurationsController.getControls()
        },
        async deleteModel(e) {
            e.preventDefault();
            this.$swal({
                title: 'Are you sure?',
                text: 'You can\'t revert your action',
                type: 'error',
                showCancelButton: true,
                cancelButtonText: 'No, Keep it!',
                confirmButtonClass: 'btn btn-danger',
                confirmButtonText: 'Yes Delete it!',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if (result.value) {
                    if (configurationsController.deleteModel(this.data.activeView, this.data.structureType, this.data.id)) {
                        this.$swal('Deleted', 'You successfully deleted this file', 'success')
                    } else {
                        this.$swal('Cancelled', 'Please try again')
                    }
                } else {
                    this.$swal('Cancelled', 'Your file is still intact', 'info')
                }
            })
        },
        async updateModel(structureType) {
            await this.getControls()
            this.showForm = true
            if (this.showForm === true) {
                let div = await document.createElement('div');
                div.id = 'update-' + structureType + '-form'
                div.innerHTML = await document.getElementById('update' + structureType + 'form').innerHTML;
                this.showForm = false;
                await this.$swal({
                    title: "Update " + structureType + " form",
                    html: div,
                    didOpen: () => {
                        Object.keys(this.data).map((key) => {
                            if (key === 'value') {
                                // je ne fais rein
                            } else {
                                if (this.controls[structureType].schema.properties[key] !== undefined) {
                                    let inputId = (key.replace("/", "")).replace("_", "-")
                                    if (this.controls[structureType].schema.properties[key].type === 'boolean') {
                                        $('#update-' + structureType + '-form .field-wrap #' + inputId)[0].checked = this.data[key]
                                    } else {
                                        $('#update-' + structureType + '-form .field-wrap #' + inputId)[0].value = this.data[key]
                                    }
                                }
                            }
                        })
                    },
                    preConfirm: () => {
                        let data = {};
                        Object.keys(this.controls[structureType].schema.properties).map((key) => {
                            if (key === 'value') {
                                data[key] = ''
                            } else {
                                if (this.controls[structureType].schema.properties[key].type === 'boolean') {
                                    data[key] = document.getElementById(key.replace("_", "-")).checked
                                } else {
                                    data[key] = document.getElementById(key.replace("_", "-")).value
                                }
                            }
                        })
                        let r = configurationsController.controlModel(this.controls[structureType].schema, data);
                        if (r.isValid === false) {
                            $('#update-' + structureType + '-form .wrapper.has-error').removeClass('has-error')
                            let inputId = (r.data[0].instancePath.replace("/", "")).replace("_", "-")
                            $('#update-' + structureType + '-form .field-wrap #' + inputId).parent('div').addClass('has-error')
                            $('#update-' + structureType + '-form .field-wrap #' + inputId).focus();
                            this.$swal.showValidationMessage(
                                `${r.data[0].instancePath.replace("/", "")}: ${r.data[0].message}`
                            )
                        } else {
                            $('#update-' + structureType + '-form .wrapper.has-error').removeClass('has-error')
                            return data
                        }
                    },
                    showCancelButton: true,
                    cancelButtonClass: 'btn btn-light',
                    cancelButtonText: "Cancel",
                    showConfirmButton: true,
                    confirmButtonClass: 'btn btn-primary',
                    confirmButtonText: "Update",
                    showLoaderOnConfirm: true,
                    showCloseButton: true,
                    // eslint-disable-next-line no-unused-vars
                }).then((result) => {
                    if (result.isConfirmed === true) {
                        configurationsController.updateModel(result.value, this.data.id, structureType, this.data.activeView)
                    }
                });

            }
        },
        previewModel: async function (structureType) {
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
                    let options = utils.createOption(this.data)
                    options.series = this.series
                    options.chart.height = 400
                    let chart = new ApexCharts(div, options);
                    if (structureType === "chart") {
                        chart.render();
                        if (this.data.is_monitoring === true) {
                            setInterval(() => {
                                Object.keys(this.series).map((item) => {
                                    this.series[item].data.push([Date.now(), Math.floor(Math.random() * (37 - 30) + 30)])
                                });
                                chart.updateSeries(this.series)
                            }, 1000);
                        } else {
                            Object.keys(this.series).map((item) => {
                                for (let step = 0; step <= 4; step++) {
                                    this.series[item].data.push([Date.now() - (step * 24 * 60 * 60 * 1000), Math.floor(Math.random() * (37 - 30) + 30)])
                                }
                            });
                            chart.updateSeries(this.series)
                        }
                    } else {
                        if (structureType === "card") {
                            div.innerHTML = '<div class="stat-card bg-gradient-' + this.data.color + ' pointer">\n' +
                                '    <div class="icon">\n' +
                                '        <i class="' + this.data.icon + ' f-left"></i>\n' +
                                '    </div>\n' +
                                '    <div class="content">\n' +
                                '        <h2><strong class="' + this.data.type + ' f-right">' + value + '</strong></h2>\n' +
                                '        <p class="mb-1 label f-right"><strong>' + this.data.title + '</strong></p>\n' +
                                '    </div>\n' +
                                '</div>'
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


