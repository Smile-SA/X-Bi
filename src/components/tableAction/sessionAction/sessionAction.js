import * as configurationsController from "../../../controller/configurationsController";
import Vue from 'vue'
Vue.component('my-component', {
    template: '<div>A custom component!</div>'
})

export default {
    name: 'session-action',
    components: {
    },
    props: ['data'],
    data() {
        return {
            formOptions: {
                validateAfterChanged: true
            },
            model : {},
            form : {},
        }
    },
    computed: {},
    mounted() {

    },
    methods: {
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
                    if (configurationsController.deleteModel(this.data.viewName, this.data.viewStructure, this.data.id)) {
                        this.$swal('Deleted', 'You successfully deleted this file', 'success')
                    } else {
                        this.$swal('Cancelled', 'Please try again')
                    }
                } else {
                    this.$swal('Cancelled', 'Your file is still intact', 'info')
                }
            })
        },
        // async updateModel() {
        //     await this.$swal.fire({
        //         html: '<div id="VueSweetAlert2"></div>',
        //         showConfirmButton: false,
        //         onBeforeOpen: () => {
        //             let ComponentClass = Vue.extend(Vue.component('my-component'));
        //             let instance = new ComponentClass({
        //                 propsData: propsData,
        //             });
        //             instance.$mount();
        //             document.getElementById('VueSweetAlert2').appendChild(instance.$el);
        //         }
        //     });
        //
        //     // let  r = configurationsController.getForm(this.data.viewStructure);
        //     // if (Object.keys(r.data.results).length > 0) {
        //     //     this.form = r.data.results;
        //     // }
        //     // await configurationsController.getModelToUpdate(this.data.viewName, this.data.viewStructure, this.data.id).then(r => {
        //     //     if (r.data.errors !== true) {
        //     //         if (Object.keys(r.data).length > 0) {
        //     //             this.model = r.data.results;
        //     //         }
        //     //     }
        //     // })
        //     // if (Object.keys(this.model).length > 0 && Object.keys(this.form).length > 0) {
        //     //     await this.$swal({
        //     //         text: "edit Model",
        //     //         html: '<div id="modal"><vue-form-generator></vue-form-generator></div>',
        //     //         preConfirm: () => [
        //     //             {
        //     //                 "title": document.getElementById("title").value,
        //     //                 "icon": document.getElementById("icon").value,
        //     //                 "color": document.getElementById("color").value,
        //     //                 "type": document.getElementById("type").value,
        //     //                 "key": document.getElementById("key").value,
        //     //                 "query": document.getElementById("query").value,
        //     //                 "redirect": document.getElementById("redirect").value,
        //     //             }
        //     //         ],
        //     //         showCancelButton: true,
        //     //         cancelButtonClass: 'btn btn-light',
        //     //         cancelButtonText: "cancel",
        //     //         showConfirmButton: true,
        //     //         confirmButtonClass: 'btn btn-primary',
        //     //         confirmButtonText: "Submit",
        //     //         showLoaderOnConfirm: true,
        //     //         showCloseButton: true,
        //     //         // eslint-disable-next-line no-unused-vars
        //     //     }).then((result) => {
        //     //         if (result.isConfirmed === true) {
        //     //             // configurationsController.addCardModels(result.value[0], this.activeView)
        //     //         }
        //     //     });
        //     // }
        //
        //     /*e.preventDefault();
        //     let tbody = e.composedPath()[this.data.deleteTagIndex + 1];
        //     let tr = e.composedPath()[this.data.deleteTagIndex];
        //     let children = tbody.children.length;
        //     this.$swal({
        //       title: 'Are you sure?',
        //       text: 'You can\'t revert your action',
        //       type: 'error',
        //       showCancelButton: true,
        //       cancelButtonText: 'No, Keep it!',
        //       confirmButtonClass: 'btn btn-danger',
        //       confirmButtonText: 'Yes Delete it!',
        //       showCloseButton: true,
        //       showLoaderOnConfirm: true
        //     }).then((result) => {
        //       if (result.value) {
        //
        //         general.generalDelete(this.data.url + '/delete', this.data.deleteParam, this.data.id).then((r) => {
        //           if (r === true) {
        //             tr.remove();
        //             if (children <= 1) {
        //               tbody.innerHTML = '<tr><td colspan=' + this.data.colspan + '>No record found</td></tr>';
        //             }
        //           }
        //         });
        //         this.$swal('Deleted', 'You successfully deleted this file', 'success')
        //       } else {
        //         this.$swal('Cancelled', 'Your file is still intact', 'info')
        //       }
        //     })*/
        // },
    }
}


