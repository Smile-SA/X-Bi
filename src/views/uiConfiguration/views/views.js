import * as configurationsController from "../../../controller/configurationsController";
import displayView from "../../../components/tableAction/edit/editViewsDisplay";
import editIcon from "../../../components/tableAction/displayIcon";
import actions from "../../../components/tableAction/sessionAction";

export default {
    name: 'views',
    components: {},
    props: [],
    data() {
        return {
            templatesNb: 0,
            tableData: {},
            views: {},
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
        async getViews() {
            this.views = {}
            let s = configurationsController.getDynamicViews();
            if (s.data.errors !== true) {
                if (Object.keys(s.data).length > 0) {
                    await Object.keys(s.data.results).map((key) => {
                        s.data.results[key].id = s.data.results[key].name
                        s.data.results[key].structureType = 'view'
                        s.data.results[key].url = '/structure'
                        s.data.results[key].deleteTagIndex = '4'
                        s.data.results[key].colspan = ''
                        s.data.results[key].deleteParam = ''
                        s.data.results[key].isDisplayed = true
                        s.data.results[key].isPreviewed = false
                        s.data.results[key].isUpdated = true
                        s.data.results[key].isDeleted = true
                    });
                    this.views = s.data.results
                    this.bindData();
                }
            }
        },
        getControls() {
            this.controls = configurationsController.getControls()
        },
        async bindData() {
            this.tableData = {};
            this.tableData['view'] = {
                data: this.views,
                showDownloadButton: false,
                columns: [
                    {
                        key: "name",
                        title: "Name",
                    },
                    {
                        key: "description",
                        title: "Description",
                    },
                    {
                        key: "path",
                        title: "Path",
                    },
                    {
                        key: "icon",
                        title: "icon",
                        component: editIcon,
                    },
                    {
                        key: "display",
                        title: "Display",
                        component: displayView
                    },
                    {
                        title: "Actions",
                        component: actions
                    }
                ]
            };
        },
        async addView(structureType) {
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
                            if (key === 'value' || key === 'structure' || key === 'path' || key === 'displayInMenu' || key === 'requiresAuth') {
                                data[key] = ''
                            } else {
                                if (controls[structureType].schema.properties[key].type === 'boolean') {
                                    data[key] = document.getElementById(key.replace("_", "-")).checked
                                } else {
                                    data[key] = document.getElementById(key.replace("_", "-")).value
                                }
                            }
                        })
                         data.path = data.name.replace(" ", "")
                         data.displayInMenu = true
                         data.requiresAuth = true
                         data.structure = {
                             "select": {
                                 "models": [],
                                 "styles": {}
                             },
                             "card": {
                                 "models": [],
                                 "styles": {}
                             },
                             "chart": {
                                 "models": [],
                                 "styles": {
                                     "height": "500",
                                     "font_size": "20px"
                                 }
                             }
                         }
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
                        configurationsController.addDynamicView(result.value, structureType);
                        this.getViews();
                    }
                });
            }
        },
    },
    async beforeMount() {
        this.getViews();
        this.getControls('view');
    },
    mounted() {

    },

}


