import * as configurationsController from "../../../controller/configurationsController";
import action from "../../../components/tableAction/sessionAction";
import displayIcon from '../../../components/tableAction/displayIcon';
import $ from 'jquery';

export default {
    name: 'structure',
    components: {},
    props: ['id'],
    data() {
        return {
            uiConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            cardConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            activeView: this.$route.params.id,
            cardTypes: ["number", "date"],
            cardColors: ["primary", "success", "warning", "danger", "dark"],
            card: [],
            chart: [],
            structure: {},
            tableData: {},
            controls: {},
            showForm: {
                select: false,
                card: false,
                chart: false,
            },
            formOptions: {
                validateAfterChanged: true
            }
        }
    },
    mounted() {

    },
    async beforeMount() {
        this.activeView = this.$route.params.id;
        this.getStructure(this.activeView)
        this.getControls();
    },
    methods: {
        async bindModelsData() {
            this.tableData = {};
            if (Object.keys(this.structure).length > 0) {
                await Object.keys(this.structure).map((structureType) => {
                    this.tableData[structureType] = {
                        data: this.structure[structureType].models,
                        showDownloadButton: false,
                        columns: [],
                    }
                    Object.keys(this.controls[structureType].schema.properties).map((properties) => {
                        if (this.tableData[structureType] != undefined) {
                            if (properties === 'icon') {
                                this.tableData[structureType].columns.push({
                                    key: properties,
                                    component: displayIcon
                                })
                            } else {
                                if (properties != 'value') {
                                    this.tableData[structureType].columns.push({
                                        key: properties,
                                    })
                                }
                            }
                        }
                    })
                    this.tableData[structureType].columns.push({
                        key: "actions",
                        component: action
                    })
                });
            }
        },
        async getStructure(activeView) {
            this.structure = {}
            let s = configurationsController.getStructure(activeView)
            if (s.data.errors !== true) {
                if (Object.keys(s.data).length > 0) {
                    await Object.keys(s.data.results).map((structureType) => {
                        Object.keys(s.data.results[structureType]).map((modelType) => {
                            if (modelType === "models") {
                                Object.keys(s.data.results[structureType][modelType]).map((item) => {
                                    if (structureType === 'select') {
                                        s.data.results[structureType][modelType][item].isPreviewed = false
                                    } else s.data.results[structureType][modelType][item].isPreviewed = true
                                    s.data.results[structureType][modelType][item].isDeleted = true
                                    s.data.results[structureType][modelType][item].isUpdated = true
                                    s.data.results[structureType][modelType][item].id = item
                                    s.data.results[structureType][modelType][item].value = '0'
                                    s.data.results[structureType][modelType][item].activeView = activeView
                                    s.data.results[structureType][modelType][item].structureType = structureType
                                });
                            }
                        });
                    });
                    this.structure = s.data.results
                }
            }
            this.bindModelsData();
        },
        getControls() {
            this.controls = configurationsController.getControls()
        },
        async addModel(structureType) {
            this.showForm = {
                card: false,
                chart: false,
            }
            this.showForm[structureType] = true
            if (this.showForm[structureType] === true) {
                let div = await document.createElement('div');
                div.id = 'add-' + structureType + '-form'
                let el = await document.getElementById('add' + structureType + 'form');
                div.innerHTML = el.innerHTML;
                this.showForm = {
                    select: false,
                    card: false,
                    chart: false,
                }
                await this.$swal({
                    title: "Add " + structureType + " form",
                    html: div,
                    preConfirm: () => {
                        let data = {}, controls = configurationsController.getControls();
                        Object.keys(controls[structureType].schema.properties).map((key) => {
                            let doc = document.getElementById(key.replace("_", "-"))
                            if (doc) {
                                if (controls[structureType].schema.properties[key].type === 'boolean') {
                                    data[key] = doc.checked
                                } else {
                                    data[key] = doc.value
                                }
                            } else {
                                data[key] = ''
                            }
                        })
                        let r = configurationsController.controlModel(controls[structureType].schema, data);
                        if (r.isValid === false) {
                            $('#add-' + structureType + '-form .wrapper.has-error').removeClass('has-error')
                            let inputId = r.data[0].instancePath.replace("/", "")
                            inputId = inputId.replace("_", "-")
                            $('#add-' + structureType + '-form .field-wrap #' + inputId).parent('div').addClass('has-error')
                            $('#add-' + structureType + '-form .field-wrap #' + inputId).focus();
                            this.$swal.showValidationMessage(
                                `${r.data[0].instancePath.replace("/", "")}: ${r.data[0].message}`
                            )
                        } else {
                            $('#add-' + structureType + '-form .wrapper.has-error').removeClass('has-error')
                            return data
                        }
                    },
                    showCancelButton: true,
                    cancelButtonClass: 'btn btn-light',
                    cancelButtonText: "cancel",
                    showConfirmButton: true,
                    confirmButtonClass: 'btn btn-primary',
                    confirmButtonText: "Submit",
                    showLoaderOnConfirm: true,
                    showCloseButton: true,
                    // eslint-disable-next-line no-unused-vars
                }).then((result) => {
                    if (result.isConfirmed === true) {
                        configurationsController.addModel(result.value, structureType, this.activeView);
                        this.getStructure(this.activeView);
                    }
                });

            }
        },
    }
}

