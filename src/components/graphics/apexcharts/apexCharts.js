import VueApexCharts from 'vue-apexcharts'
import * as general from "../../../controller/genaralController";

export default {
    name: 'apexCharts', components: {
        apexcharts: VueApexCharts,
    }, props: ['configuration', 'styles', 'from', 'to', 'group', 'queryBegin', 'name'], data() {
        return {
            data: {},
        }
    }, methods: {
        async getApexData() {
            this.data.height = undefined;
            if (this.configuration.monitoring === true){
                general.getDataByDateToApex(this.configuration, this, this.name).then(async (r) => {
                    if(r.total !== undefined && r.total > 0){
                        this.data = r;
                    }
                });
            } else {
                await general.getDataByVariableAndDateToApex(this.configuration, this).then(async (r) => {
                    if (r.total > 0) {
                        this.data = r;
                    }
                });
            }
        },
        async refreshChart() {
            if (this.configuration.monitoring === true) {
                await setInterval(() => {
                    if (this.data.height != undefined) {
                        general.getDataByDateToApex(this.configuration, this, this.name).then(async (r) => {
                            if (r.lastDate > this.data.lastDate) {
                                this.data.series = r.series;
                                this.data.lastDate = r.lastDate;
                            }
                        });
                    }
                }, 1000);
            }
        },
    }, mounted() {
        this.getApexData();
        this.refreshChart();
    },
}
