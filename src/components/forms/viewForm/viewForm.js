import * as configurationsController from "../../../controller/configurationsController";
import FormSchema from '@formschema/native';

export default {
    name: 'view-form',
    components: {FormSchema},
    props: ['id'],
    data() {
        return {
            schema: [
                {
                    "component": "FormulateInput",
                    "type": "select",
                    "name": "space",
                    "placeholder": "Select the space per row",
                    "options": {
                        "1/2":"1/2",
                        "2/2":"2/2"
                    },
                    "validation": "required"
                },
                {
                    "component": "FormulateInput",
                    "type": "text",
                    "name": "title",
                    "placeholder": "Enter chart title",
                    "validation": "required|min:1,length|max:99,length"
                },
                {
                    "component": "FormulateInput",
                    "type": "select",
                    "name": "type",
                    "placeholder": "Select chart type",
                    "options": {
                        "area": "area",
                        "bar": "bar",
                        "donut": "donut",
                        "heatmap": "heatmap",
                        "histogram": "histogram",
                        "line": "line",
                        "polarArea": "polarArea",
                        "radar": "radar",
                        "radialBar": "radialBar",
                        "scatter": "scatter"
                    },
                    "validation": "required",
                },
                {
                    "component": "FormulateInput",
                    "type": "text",
                    "name": "query",
                    "placeholder": "Enter query link",
                    "validation": "required"
                },
                {
                    "component": "FormulateInput",
                    "type": "text",
                    "name": "query_key",
                    "placeholder": "Enter query key",
                    "validation": "required"
                },
                {
                    "component": "FormulateInput",
                    "type": "text",
                    "name": "sort_key",
                    "placeholder": "Enter sort key",
                    "validation":"required"
                },
                {
                    "component": "FormulateInput",
                    "type": "text",
                    "name": "time_key",
                    "placeholder": "Enter time key",
                    "validation":"required"
                },
                {
                    "component": "FormulateInput",
                    "type": "select",
                    "name": "method",
                    "placeholder": "Select calculation method",
                    "options": {
                        "default":"default",
                        "top":"top",
                        "down":"down"
                    },
                    "validation": "required"
                },
                {
                    "component": "FormulateInput",
                    "type": "checkbox",
                    "name": "is_monitoring",
                    "label": "Is monitoring",
                },
                {
                    "component": "FormulateInput",
                    "name": "submit",
                    "type": "submit"
                }
            ],
            model: {},
            controls: {},
        }
    },
    computed: {

    },
    methods: {
        getControls() {
            this.controls = configurationsController.getControls()
        },
        show() {
            this.$modal.show('view-form');
        },
        hide() {
            this.$modal.hide('view-form');
        },
        reset() {
            this.$formulate.reset('form')
        },
        add(){
            // if(this.id=="view"){
            //     if(this.model.display != true){
            //         this.model.display = false;
            //     }
            // }
          console.log(this.model)
        },
        updateValidationrequired(){
            Object.keys(this.schema).map((key) => {
                if(this.schema[key].condition != undefined && this.schema[key].condition === true){
                    Object.keys(this.schema).map((id) => {
                        if(this.schema[id].conditionFields != undefined ){
                            if(this.schema[id].conditionFields.id === this.schema[key].name){
                                if(this.schema[id].conditionFields.values.includes(this.model[this.schema[key].name])){
                                    this.schema[id].validation = this.schema[id].conditionFields.validation
                                }else{
                                    this.schema[id].validation = ''
                                }
                            }
                        }
                    });
                }
            });
        },
        showInput(input){
            this.updateValidationrequired();
            let r =  input.conditionFields ? input.conditionFields.values.includes(this.model[input.conditionFields.id] )  ? true : false : true
            console.log(r)
            return r
        },
    },
    beforeMount() {
        this.getControls('view');
    }
}


