const uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations')).default;
const views = uiConfigurations.views;
const controls = uiConfigurations.controls;
const Ajv = require("ajv");
const ajv = new Ajv();

export function getCard(activeView) {
    let r = views[activeView].structure.card.models;
    if(Object.keys(r).length>0){
        return {
            errors: false,
            data: {
                total : Object.keys(r).length,
                results : r
            }
        }
    }else{
        return{
            errors: true,
            data: null
        }
    }
}
export function getCardModels(activeView){
    const r = views[activeView].structure.card.models;
    if(Object.keys(r).length>0){
        return {
            errors: false,
            data: {
                total : Object.keys(r).length,
                results : r
            }
        }
    }else{
        return{
            errors: true,
            data: null
        }
    }
}
export function getCardStyles(activeView) {
    let r = views[activeView].structure.card.styles;
    console.log(r)
    if(Object.keys(r).length>0){
        return {
            errors: false,
            data: {
                total : Object.keys(r).length,
                results : r
            }
        }
    }else{
        return{
            errors: true,
            data: null
        }
    }
}
export function getCardForm(){
    return  controls.card.form
}
export function getCardSchema(){
    return  controls.card.schema
}
export function addCardModels(schema,model,activeView) {
    let r = controlModel(schema,model);
    if(r.isValid){
        views[activeView].structure.card.models.push(model);
        window.sessionStorage.setItem('views', JSON.stringify(views));
    }
}

export function getChart(activeView) {
    let r = views[activeView].structure.chart.models;
    if(Object.keys(r).length>0){
        return {
            errors: false,
            data: {
                total : Object.keys(r).length,
                results : r
            }
        }
    }else{
        return{
            errors: true,
            data: null
        }
    }
}
export function getChartModels(activeView) {
    let r = views[activeView].structure.chart.models;
    if(Object.keys(r).length>0){
        return {
            errors: false,
            data: {
                total : Object.keys(r).length,
                results : r
            }
        }
    }else{
        return{
            errors: true,
            data: null
        }
    }
}
export function getChartStyles(activeView) {
    let r = views[activeView].structure.chart.styles;
    if(r!==null){
        return {
            errors: false,
            data: {
                results : r
            }
        }
    }else{
        return{
            errors: true,
            data: null
        }
    }
}
export function addChartModel(schema,model,activeView) {
    let r = controlModel(schema,model);
    if(r.isValid){
        views[activeView].structure.chart.models.push(model);
        window.sessionStorage.setItem('views', JSON.stringify(views));
    }
}
export function getChartForm(){
    return  controls.chart.form
}
export function getChartSchema(){
    return  controls.chart.schema
}





export function controlModel(schema,model) {
    console.log(schema)
    console.log(model)
    const valid = ajv.validate(schema, model)
    let r;
    if (valid) {
        r = {
            isValid : true,
        }
    }else{
        console.log(ajv.errors)
        r = {
            isValid : false,
            data : ajv.errors
        }
    }
    return r
}