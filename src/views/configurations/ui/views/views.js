import * as configurationsController from "../../../../controller/configurationsController";
import viewDisplay from "../../../../components/uiForms/displayCheckBox";
import displayIcon from "../../../../components/layout/displayIcon";
import actions from "../../../../components/tableAction/sessionAction";
import * as utils from "../../../../settings/utils";
//this.$router.go(this.$router.currentRoute)

export default {
    name: 'views',
    props: [],
    data() {
        return {
            tableData: {},
            views: {},
            hover: true,
        }
    },
    methods: {
        async getViews() {
            this.views = []
            let data = configurationsController.getDynamicViews();
            let table = []
            if (Object.keys(data).length > 0) {
                // eslint-disable-next-line no-unused-vars
                Object.keys(data).map((index) => {
                    table[index] = {}
                    Object.keys(data[index]).map((id) => {
                        table[index][id] = data[index][id];
                    });
                    table[index].viewId = index
                    table[index].modelId = index
                    table[index].structureType = 'view'
                    table[index].url = '/ui/structures'
                    table[index].deleteTagIndex = '4'
                    table[index].colspan = ''
                    table[index].deleteParam = ''
                    table[index].isDisplayed = true
                    table[index].isPreviewed = false
                    table[index].isUpdated = true
                    table[index].isDeleted = true
                    table[index].refreshFunction = this.getViews
                });
                this.views = table;
                await this.bindData();
            }
        },
        async bindData() {
            this.tableData = {};
            this.tableData['view'] = {
                data: this.views,
                showDownloadButton: false,
                columns: [
                    {
                        key: "name",
                        title: "Name",
                    },
                    {
                        key: "description",
                        title: "Description",
                    },
                    {
                        key: "path",
                        title: "Path",
                    },
                    {
                        key: "icon",
                        title: "icon",
                        component: displayIcon,
                    },
                    {
                        key: "display",
                        title: "Display",
                        component: viewDisplay
                    },
                    {
                        title: "Actions",
                        component: actions
                    }
                ]
            };
        },
    },
    async beforeMount() {
        this.getViews();
        utils.titleBoxRender(this)
    },
}


