import * as general from "../../../controller/genaralController";
export default {
    name: 'table-action',
    components: {},
    props: ['data'],
    data() {
        return {}
    },
    computed: {},
    mounted() {

    },
    methods: {
        submitDeleteForm(e) {
            e.preventDefault();
            let tbody = e.composedPath()[this.data.deleteTagIndex + 1];
            let tr = e.composedPath()[this.data.deleteTagIndex];
            let children = tbody.children.length;
            this.$swal({
                title: 'Are you sure?',
                text: 'You can\'t revert your action',
                type: 'error',
                showCancelButton: true,
                cancelButtonText: 'No, Keep it!',
                confirmButtonClass:'btn btn-danger',
                confirmButtonText: 'Yes Delete it!',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    general.generalDelete(this.data.url + '/delete', this.data.deleteParam, this.data.id).then((r) => {
                        if (r === true) {
                            tr.remove();
                            if (children <= 1) {
                                tbody.innerHTML = '<tr><td colspan=' + this.data.colspan + '>No record found</td></tr>';
                            }
                        }
                    });
                    this.$swal('Deleted', 'You successfully deleted this file', 'success')
                } else {
                    this.$swal('Cancelled', 'Your file is still intact', 'info')
                }
            })
        },
    }
}





