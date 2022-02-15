import * as cardController from "../../../controller/configurationsController";
import VueFormGenerator from 'vue-form-generator'

export default {
    name: 'views',
    components: {
        "vue-form-generator": VueFormGenerator.component
    },
    props: [],
    data() {
        return {
            uiConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            cardConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            views: [],
            activeView: null,
            cardTypes: ["number", "date"],
            cardColors: ["primary", "success", "warning", "danger", "dark"],
            cards: [],
            charts: [],
            cardSchema: {},
            formOptions: {
                validateAfterChanged: true
            }
        }
    },
    computed: {
        bindCharts() {
            return {
                data: this.uiConfigurations.default[this.activeView].structure.chart.models,
                showDownloadButton: false,
                columns: [
                    {
                        key: "id",
                        title: "ID"
                    },
                    {
                        key: "labelsTitle",
                        title: "Label title"
                    },
                    {
                        key: "type",
                        title: "Chart type"
                    },
                    {
                        key: "xaxisType",
                        title: "X axis type"
                    },
                    {
                        key: "queryLink",
                        title: "Query link"
                    },
                ]
            }
        },
        bindCards() {
            return {
                data: this.cards.models,
                showDownloadButton: false,
                columns: [
                    {
                        key: "name",
                        title: "Name"
                    },
                    {
                        key: "color",
                        title: "Color"
                    },
                    {
                        key: "icon",
                        title: "Icon"
                    },
                    {
                        key: "type",
                        title: "Type"
                    },
                    {
                        key: "redirect",
                        title: "Redirect after click"
                    },
                    {
                        key: "query",
                        title: "Query link"
                    },
                ]
            }
        }
    }
    ,
    mounted() {
        this.getViews();
    }
    ,
    methods: {
        async getCards(activeView) {
            this.cards = []
            let r = cardController.getCard(activeView)
            if (r.data.errors !== true) {
                if (r.data.total > 0) {
                    this.cards = r.data.results;
                }
            }
        },
        async getCharts(activeView) {
            this.charts = []
            let r = cardController.getChart(activeView)
            if (r.data.errors !== true) {
                if (r.data.total > 0) {
                    this.charts = r.data.results;
                }
            }
        }
        ,
        getViews() {
            this.views = [];
            Object.keys(this.uiConfigurations.default).map((item) => {
                this.views.push(item);
            });
        }
        ,
        setView(view) {
            this.activeView = view.target.value;
            this.getCards(this.activeView)
            this.getCharts(this.activeView)
        }
        ,
        async addCard() {
            let el = document.getElementById('swalHTML');
            let form = '<div class="grid-margin stretch-card" id="cardForm">' + el.innerHTML + '</div>';
            el.remove();
            // let form = ' <vue-form-generator :schema="'+this.cards.form+'"  :options="'+this.formOptions+'"></vue-form-generator>'
            await this.$swal({
                text: "edit child",
                html: form,
                preConfirm: () => [
                    {
                        "name": document.getElementById("name").value,
                        "icon": document.getElementById("icon").value,
                        "color": document.getElementById("color").value,
                        "type": document.getElementById("type").value,
                        "key": document.getElementById("key").value,
                        "query": document.getElementById("query").value,
                        "redirect": document.getElementById("redirect").value,
                    }
                ],
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
                    cardController.addCardModel(this.cards.schema,result.value[0], this.activeView)
                }
            });
        }
        ,
        async addChart() {
            let el = document.getElementById('swalHTML2');
            let form = '<div class="grid-margin stretch-card" id="cardForm">' + el.innerHTML + '</div>';
            el.remove();
            await this.$swal({
                text: "edit child",
                html: form,
                preConfirm: () => [
                    {
                        "id": document.getElementById("id").value,
                        "type": document.getElementById("type").value,
                        "title": document.getElementById("title").value,
                        "query": document.getElementById("query").value,
                        "sort_id": document.getElementById("sort-id").value,
                        "time_id": document.getElementById("time-id").value,
                        "value_id": document.getElementById("value-id").value,
                        "axis_type": document.getElementById("axis-type").value
                    }
                ],
                showCancelButton: true,
                cancelButtonClass: 'btn btn-light',
                cancelButtonText: "cancel",
                showConfirmButton: true,
                confirmButtonClass: 'btn btn-primary',
                confirmButtonText: "Submit",
                showLoaderOnConfirm: true,
                showCloseButton: true,
            }).then((result) => {
                if (result.isConfirmed === true) {
                    cardController.addChartModel(this.charts.schema,result.value[0], this.activeView)
                }
            });
        }
    }
}


