import * as configurationsController from "../../../../controller/configurationsController";
import action from "../../../../components/tableAction/sessionAction";
import displayIcon from '../../../../components/layout/displayIcon';
import * as utils from "../../../../settings/utils";

export default {
    name: 'structure',
    components: {},
    props: ['id'],
    data() {
        return {
            uiConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            cardConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            viewId: this.$route.params.id,
            cardTypes: ["number", "date"],
            cardColors: ["primary", "success", "warning", "danger", "dark"],
            hover: true,
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
    methods: {
        async bindModelsData() {
            this.tableData = {};
            if (Object.keys(this.structure).length > 0) {
                await Object.keys(this.structure).map((structureType) => {
                    this.tableData[structureType] = {
                        data: this.structure[structureType].models, showDownloadButton: false, columns: [],
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
        async getStructure() {
            this.structure = {}
            let data = configurationsController.getStructure(this.viewId)
            let table = [];
            if (Object.keys(data).length > 0) {
                    await Object.keys(data).map((structureType) => {
                        table[structureType] = []
                        Object.keys(data[structureType]).map((modelType) => {
                            if (modelType === "models") {
                                table[structureType][modelType] = [];
                                Object.keys(data[structureType][modelType]).map((item) => {
                                    table[structureType][modelType][item]={}
                                    table[structureType][modelType][item].isDeleted = true
                                    table[structureType][modelType][item].isUpdated = true
                                    table[structureType][modelType][item].modelId = item
                                    table[structureType][modelType][item].value = '0'
                                    table[structureType][modelType][item].viewId = this.viewId
                                    table[structureType][modelType][item].structureType = structureType
                                    table[structureType][modelType][item].refreshFunction = this.getStructure
                                    Object.keys(data[structureType][modelType][item]).map((id) => {
                                        table[structureType][modelType][item][id] = data[structureType][modelType][item][id];
                                    });
                                    if (structureType === 'select') {
                                        table[structureType][modelType][item].isPreviewed = false
                                    } else table[structureType][modelType][item].isPreviewed = true
                                });
                            }
                        });
                    });
                    this.structure = table
                }
            this.bindModelsData();
        },
        getControls() {
            this.controls = configurationsController.getControls()
        },
        async addModel(structureType) {
            this.showForm = {
                select: false,
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
                            if(!doc){
                                doc = document.getElementById(key.replace("_", "-"))
                            }
                            if(doc){
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
                        configurationsController.addModel(result.value, structureType, this.viewId).then(r=>{
                            if(r==true){
                                this.getStructure();
                            }
                        })
                    }
                });

            }
        },
    },
    async beforeMount() {
        this.viewId = this.$route.params.id;
        this.getStructure();
        this.getControls();
        utils.titleBoxRender(this)
    },
}

