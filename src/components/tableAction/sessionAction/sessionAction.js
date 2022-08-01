import * as configurationsController from "../../../controller/configurationsController";
import * as utils from "../../../settings/utils";
import ApexCharts from 'apexcharts';
import $ from 'jquery';

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
        this.getControls()
    },
    methods: {
        getControls() {
            this.controls = configurationsController.getControls()
        },
        async deleted(e) {
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
                    configurationsController.deleteModel(this.data.activeView ? this.data.activeView : this.data.name, this.data.structureType, this.data.id).then(r => {
                        if (r == true) {
                            if (this.data.afterDeleteFunction != undefined) {
                                this.data.afterDeleteFunction(this.data.activeView)
                            }
                            // eslint-disable-next-line no-unused-vars
                            this.$swal('Deleted', 'You successfully deleted this file', 'success').then((r) => {
                                if (this.structure === "view") {
                                    this.$router.go(this.$router.currentRoute)
                                }
                            });
                        } else this.$swal('Cancelled', 'Please try again')
                    });

                } else {
                    this.$swal('Cancelled', 'Your file is still intact', 'info')
                }
            })
        },
        async updated(structureType) {
            this.showForm = true;
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
                            let inputId = (key.replace("/", "")).replace("_", "-")
                            if ($('#update-' + structureType + '-form .field-wrap #' + inputId)[0]) {
                                if (this.controls[structureType].schema.properties[key] !== undefined) {
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
                            if (document.getElementById(key.replace("_", "-"))) {
                                if (this.controls[structureType].schema.properties[key].type === 'boolean') {
                                    data[key] = document.getElementById(key.replace("_", "-")).checked
                                } else {
                                    data[key] = document.getElementById(key.replace("_", "-")).value
                                }
                            } else {
                                if (this.data[key] !== undefined) {
                                    data[key] = this.data[key]
                                }
                            }
                        })
                        if (data.path) {
                            data.path = '/' + data.name.replace(' ', "")
                        }
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
                        configurationsController.updateModel(result.value, this.data.id ? this.data.id : null, structureType, this.data.activeView ? this.data.activeView : this.data.name).then(r => {
                            if (r === true) {
                                if (this.data.updateFunction !== undefined) {
                                    this.data.updateFunction(this.data.activeView)
                                } else {
                                    Object.keys(result.value).map((key) => {
                                        if (this.data[key] != undefined) {
                                            this.data[key] = result.value[key]
                                        }
                                    })
                                }
                                // eslint-disable-next-line no-unused-vars
                                this.$swal('Updated', 'You successfully updated your configuration', 'success').then((r) => {
                                    if (this.structure === "view") {
                                        this.$router.go(this.$router.currentRoute)
                                    }
                                });
                            }else this.$swal('Cancelled', 'Please try again')
                        })

                    }
                });
            }
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


