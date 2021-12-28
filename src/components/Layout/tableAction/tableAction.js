import {generalDelete} from "../../../controller/genaralController";

export default {
    name: 'table-action',
    components: {},
    props: ['id', 'deleteParam', 'url', 'deleteTagIndex', 'colspan', 'isDisplay', 'isUpdate', 'isDelete',],
    data() {
        return {}
    },
    computed: {},
    mounted() {

    },
    methods: {
        submitDeleteForm(e) {
            e.preventDefault();
            let tbody = e.composedPath()[this.deleteTagIndex + 1];
            let tr = e.composedPath()[this.deleteTagIndex];
            let children = tbody.children.length;
            generalDelete(this.url + '/delete', this.deleteParam, this.id).then((r) => {
                if (r === true) {
                    tr.remove();
                    let body = document.querySelector("body");
                    body.classList.remove("modal-open");
                    body.style.paddingRight = null;
                    this.removeElementsByClass("modal-backdrop in");
                    if (children <= 1) {
                        tbody.innerHTML = '<tr><td colspan=' + this.colspan + '>No record found</td></tr>';
                    }
                }
            });

        },
        removeElementsByClass(className) {
            const elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        }
    }
}


