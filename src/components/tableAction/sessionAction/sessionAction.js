import * as configurationsController from "../../../controller/configurationsController";
import Vue from 'vue'

Vue.component('my-component', {
    template: '<div>A custom component!</div>'
})

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
        }
    },
    computed: {},
    mounted() {
    },
    methods: {
        getControls() {
            this.controls = configurationsController.getControls()
        },
        deleteModel(e) {
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
                let el = await document.getElementById('update' + structureType + 'form');
                this.showForm = false;
                div.innerHTML = el.innerHTML;
                await el.remove();
                await this.$swal({
                    title: "Update " + structureType + " form",
                    html: div,
                    didOpen: () => {
                         Object.keys(this.data).map((key) => {
                            if (key === 'value') {
                                // je ne fais rein
                            } else {
                                if(this.controls[structureType].schema.properties[key]!==undefined){
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
                    cancelButtonText: "cancel",
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
    }
}


