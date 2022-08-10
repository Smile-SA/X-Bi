import * as configurationsController from "../../../../controller/configurationsController";
import action from "../../../../components/tableAction/sessionAction";
import displayIcon from '../../../../components/layout/displayIcon';
import * as utils from "../../../../settings/utils";

export default {
    name: 'structure',
    components: {},
    props: ['id'],
    data() {
        return {
            viewId: this.$route.params.id,
            hover: true,
            structure: {},
            tableData: {},
        }
    },
    methods: {
        async bindModelsData() {
            this.tableData = {};
            if (Object.keys(this.structure).length > 0) {
                await Object.keys(this.structure).map((structureType) => {
                    this.tableData[structureType] = {
                        data: this.structure[structureType].models, showDownloadButton: false, columns: [],
                    }
                    let form = configurationsController.getForm(structureType);
                    Object.keys(form).map((id) => {
                        if (form[id].name === 'icon') {
                            this.tableData[structureType].columns.push({
                                key: form[id].name,
                                component: displayIcon
                            })
                        } else {
                            if (form[id].name != 'value') {
                                this.tableData[structureType].columns.push({
                                    key: form[id].name,
                                })
                            }
                        }
                    })
                    this.tableData[structureType].columns.push({
                        key: "actions",
                        component: action
                    })
                });
            }
        },
        async getStructure() {
            this.structure = {}
            let data = configurationsController.getStructure(this.viewId)
            let table = [];
            if (Object.keys(data).length > 0) {
                await Object.keys(data).map((structureType) => {
                    table[structureType] = []
                    table[structureType].models = [];
                    Object.keys(data[structureType].models).map((item) => {
                        table[structureType].models[item] = {}
                        table[structureType].models[item].isDeleted = true
                        table[structureType].models[item].isUpdated = true
                        table[structureType].models[item].modelId = item
                        table[structureType].models[item].value = '0'
                        table[structureType].models[item].viewId = this.viewId
                        table[structureType].models[item].structureType = structureType
                        table[structureType].models[item].refreshFunction = this.getStructure
                        Object.keys(data[structureType].models[item]).map((id) => {
                            table[structureType].models[item][id] = data[structureType].models[item][id];
                        });
                        if (structureType === 'select') {
                            table[structureType].models[item].isPreviewed = false
                        } else table[structureType].models[item].isPreviewed = true
                    });
                });
                this.structure = table
            }
            this.bindModelsData();
        },
    },
    async beforeMount() {
        this.getStructure();
        utils.titleBoxRender(this)
    },
}

