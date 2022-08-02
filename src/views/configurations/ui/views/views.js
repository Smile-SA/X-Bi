import * as configurationsController from "../../../../controller/configurationsController";
import editViewsDisplay from "../../../../components/tableAction/edit/editViewsDisplay";
import displayIcon from "../../../../components/tableAction/displayIcon";
import actions from "../../../../components/tableAction/sessionAction";
import * as utils from "../../../../settings/utils";
export default {
    name: 'views',
    components: {},
    props: [],
    data() {
        return {
            templatesNb: 0,
            tableData: {},
            views: {},
            hover:true,
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
            let bind = []
            if (s.data.errors !== true) {
                if (Object.keys(s.data).length > 0) {
                    await Object.keys(s.data.results).map((key) => {
                        bind[key] = {}
                        Object.keys(s.data.results[key]).map((id) => {
                            bind[key][id] = s.data.results[key][id];
                        });
                        bind[key].id = s.data.results[key].name
                        bind[key].structureType = 'view'
                        bind[key].url = '/ui/structures'
                        bind[key].deleteTagIndex = '4'
                        bind[key].colspan = ''
                        bind[key].deleteParam = ''
                        bind[key].isDisplayed = true
                        bind[key].isPreviewed = false
                        bind[key].isUpdated = true
                        bind[key].isDeleted = true
                        bind[key].afterDeleteFunction = this.getViews
                    });
                    this.views = bind
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
                        component: displayIcon,
                    },
                    {
                        key: "display",
                        title: "Display",
                        component: editViewsDisplay
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
                }).then((r) => {
                    if (r.isConfirmed === true) {
                        if(configurationsController.addDynamicView(r.value, structureType) && configurationsController.save()){
                            this.getViews();
                            // eslint-disable-next-line no-unused-vars
                            this.$swal('Updated', 'You successfully updated your configuration', 'success').then((r) => {
                                this.$router.go(this.$router.currentRoute)
                            });
                        }
                    }
                });
            }
        },
    },
    async beforeMount() {
        this.getViews();
        this.getControls('view');
        utils.titleBoxRender(this)
    },
}


