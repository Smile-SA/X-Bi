//import $ from 'jquery';
import * as general from "../../../../controller/generalController";
import * as uiConfigurations from "@/uiConfigurations.json"
const apiInfo = uiConfigurations.apiInfo;

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
            if (apiInfo.dataType === 'static') {
                let list = JSON.parse(localStorage.getItem(`x-bi:${this.$route.name}-list`));
                list.results = list.results.filter(item => item !== this.value);
                list.total = list.total - 1;
                localStorage.setItem(`x-bi:${this.$route.name}-list`, JSON.stringify(list));
                this.data = {
                    result: list,
                    message: {
                        title: 'Successfully deleted'
                    }
                }
                return;
            }

            general.generalDelete(this.url, this.id, this.value).then((r) => {
                this.data = r
            });

        }
    },
    beforeMount() {

    }
}


