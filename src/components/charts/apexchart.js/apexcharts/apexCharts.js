import VueApexCharts from 'vue-apexcharts'
import * as general from "../../../../controller/genaralController";

export default {
    name: 'apexCharts', components: {
        apexcharts: VueApexCharts,
    }, props: ['configuration','styles', 'from', 'to', 'group'], data() {
        return {
            data: {},
        }
    }, methods: {
        async getApexData() {
            this.data.height = undefined;
            await general.getDataByVariableAndDateToApex(this.configuration, this).then(async (r) => {
                if (r.total > 0) {
                    this.data = r;
                }
            });
        },
    }, mounted() {
        this.getApexData();
    },
}

