//import $ from 'jquery';
import * as general from "../../../../controller/generalController";

export default {
    name: 'delete',
    props: ['id', 'url', 'value','refreshFunction'],
    data() {
        return {
            schema: [],
            model: {},
            controls: {},
            data: ''
        }
    },
    computed: {},
    methods: {
        show() {
            this.$modal.show('delete-view-' + this.id + this.value);
        },
        hide() {
            this.$modal.hide('delete-view-' + this.id + this.value);
            this.data = '';
            this.refreshFunction()
        },
        deleted() {
            general.generalDelete(this.url, this.id, this.value).then((r) => {
                this.data = r
            });
        }
    },
    beforeMount() {

    }
}


