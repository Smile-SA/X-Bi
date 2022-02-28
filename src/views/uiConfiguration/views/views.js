import * as configurationsController from "../../../controller/configurationsController";
import action from "@/components/tableAction/sessionAction";
import displayIcon from '@/components/tableAction/displayIcon';

export default {
    name: 'views',
    components: {},
    props: [],
    data() {
        return {
            uiConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            cardConfigurations: JSON.parse(window.sessionStorage.getItem('uiConfigurations')),
            views: [],
            activeView: null,
            cardTypes: ["number", "date"],
            cardColors: ["primary", "success", "warning", "danger", "dark"],
            card: [],
            chart: [],
            controls: {},
            showCh: false,
            showCa: false,
            formOptions: {
                validateAfterChanged: true
            }
        }
    },
    computed: {
        bindCards() {
            return {
                data: this.card.models,
                showDownloadButton: false,
                columns: [
                    {
                        key: "title",
                        title: "Title"
                    },
                    {
                        key: "icon",
                        component: displayIcon
                    },
                    {
                        key: "type",
                        title: "Type"
                    },
                    {
                        key: "query",
                        title: "Query link"
                    },
                    {
                        key: "key",
                        title: "query key"
                    },
                    {
                        key: "redirect",
                        title: "Redirect after click"
                    },
                    {
                        key: "Actions",
                        component: action
                    }
                ]
            }
        },
        bindCharts() {
            return {
                data: this.chart.models,
                showDownloadButton: false,
                columns: [
                    {
                        key: "title",
                        title: "Chart title"
                    },
                    {
                        key: "type",
                        title: "Chart type"
                    },
                    {
                        key: "query",
                        title: "Chart query link"
                    },
                    {
                        key: "sort_id",
                        title: "Chart sort id"
                    },
                    {
                        key: "time_id",
                        title: "Chart time id"
                    },
                    {
                        key: "value_id",
                        title: "Chart value id"
                    },
                    {
                        key: "axis_type",
                        title: "Chart type"
                    },
                    {
                        key: "is_monitoring",
                        title: "Chart monitoring"
                    },
                    {
                        key: "Actions",
                        component: action
                    }
                ]
            }
        }
    },
    mounted() {
        this.getViews();
        this.getControls();
    },
    methods: {
        async getCard(activeView) {
            this.card = []
            let r = configurationsController.getCard(activeView)
            if (r.data.errors !== true) {
                if (Object.keys(r.data).length > 0) {
                    this.card = r.data.results;
                    Object.keys(this.card.models).map((item) => {
                        this.card.models[item].id = item
                        this.card.models[item].viewName = activeView
                        this.card.models[item].viewStructure = "card"
                    });
                }
            }

        },
        async getChart(activeView) {
            this.chart = []
            let r = configurationsController.getChart(activeView)
            if (r.data.errors !== true) {
                if (r.data.total > 0) {
                    this.chart = r.data.results;
                    Object.keys(this.chart.models).map((item) => {
                        this.chart.models[item].id = item
                        this.chart.models[item].viewName = activeView
                        this.chart.models[item].viewStructure = "chart"
                    });
                }
            }
        },

        getViews() {
            this.views = configurationsController.getViews();
        },
        setView(view) {
            this.activeView = view.target.value;
            this.getCard(this.activeView)
            this.getChart(this.activeView)
        },

        getControls() {
            this.controls = configurationsController.getControls()
        },

        async addCard() {
            this.showCa = true
            this.showCh = false
            if (this.showCa == true) {
                let div = await document.createElement('div');
                div.id = "card-Form"
                let el = await document.getElementById('cardForm');
                div.innerHTML = el.innerHTML;
                this.showCa = false
                await this.$swal({
                    text: "edit child",
                    html: div,
                    preConfirm: () => {
                        let data = {
                            "title": document.getElementById("title").value,
                            "icon": document.getElementById("icon").value,
                            "color": document.getElementById("color").value,
                            "type": document.getElementById("type").value,
                            "query": document.getElementById("query").value,
                            "redirect": document.getElementById("redirect").value,
                            "value": "",
                            "key": document.getElementById("key").value,
                        }, controls = configurationsController.getControls()
                        let r = configurationsController.controlModel(controls.card.schema, data);
                        if (r.isValid === false) {
                            $('#card-Form .wrapper.has-error').removeClass('has-error')
                            let inputId = r.data[0].instancePath.replace("/", "")
                            inputId = inputId.replace("_", "-")
                            $('#card-Form .field-wrap #' + inputId).parent('div').addClass('has-error')
                            $('#card-Form .field-wrap #' + inputId).focus();
                            this.$swal.showValidationMessage(
                                `${r.data[0].instancePath.replace("/", "")}: ${r.data[0].message}`
                            )
                        } else {
                            $('card-Form .wrapper.has-error').removeClass('has-error')
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
                        configurationsController.addCardModel(result.value, this.activeView)
                    }
                });
            }

        },
        async addChart() {
            this.showCh = true
            this.showCa = false
            let div = await document.createElement('div');
            div.id = "chart-form"
            let el = await document.getElementById('chartForm');
            div.innerHTML = el.innerHTML;
            this.showCh = false
            await this.$swal({
                text: "edit child",
                html: div,
                preConfirm: () => {
                    let data = {
                        "type": document.getElementById("type").value,
                        "title": document.getElementById("title").value,
                        "query": document.getElementById("query").value,
                        "sort_id": document.getElementById("sort-id").value,
                        "time_id": document.getElementById("time-id").value,
                        "value_id": document.getElementById("value-id").value,
                        "axis_type": document.getElementById("axis-type").value,
                        "is_monitoring": document.getElementById("is-monitoring").checked
                    }, controls = configurationsController.getControls()
                    let r = configurationsController.controlModel(controls.chart.schema, data);
                    if (r.isValid === false) {
                        console.log(r)
                        $('#chart-form .wrapper.has-error').removeClass('has-error')
                        let inputId = r.data[0].instancePath.replace("/", "")
                         inputId = inputId.replace("_", "-")
                        $('#chart-form .field-wrap #' + inputId).parent('div').addClass('has-error')
                        $('#chart-form .field-wrap #' + inputId).focus();
                        this.$swal.showValidationMessage(
                            `${r.data[0].instancePath.replace("/", "")}: ${r.data[0].message}`
                        )
                    } else {
                        $('#chart-form .wrapper.has-error').removeClass('has-error')
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
            }).then((result) => {
                if (result.isConfirmed === true) {
                    configurationsController.addChartModel(result.value, this.activeView)
                }
            });
        }
    }
}


