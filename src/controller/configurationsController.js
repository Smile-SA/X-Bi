import * as uiConf from "../settings/uiConfigurations.json"

var uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'))
if(uiConfigurations === null){
    uiConfigurations = uiConf
}
if (uiConfigurations.default !== undefined) {
    uiConfigurations = uiConfigurations.default;
}
var views = uiConfigurations.views.dynamic;
var controls = uiConfigurations.controls;
const Ajv = require("ajv");
const ajv = new Ajv();

export function getConfig() {
    return uiConfigurations;
}

export function getStructure(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            r = views[key].structure;
        }
    })
    if (Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }

}

export function getCard(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
             r = views[key].structure.card;
        }
    })
    if (Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function getCardModels(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            r = views[key].structure.card.models;
        }
    })
    if (Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function getCardStyles(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            r = views[key].structure.card.styles;
        }
    })
    if (Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function getForm(structureType) {
    let r = controls[structureType].form
    if (r !== undefined && Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function getChart(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            r = views[key].structure.chart;
        }
    })
    if (Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function getChartModels(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            r = views[key].structure.chart.models;
        }
    })
    if (Object.keys(r).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(r).length, results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function getChartStyles(activeView) {
    let r ;
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            r = views[key].structure.chart.styles;
        }
    })
    if (r !== null) {
        return {
            errors: false, data: {
                results: r
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}

export function addModel(model, structureType, activeView) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        Object.keys(views).map((key) => {
            if(views[key].name === activeView){
                views[key].structure[structureType].models.push(model);
            }
        })
        window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
    }
}

export function save() {
        window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
}

export async function updateModel(model, id, structureType, activeView) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        await Object.keys(views).map((key) => {
            if(views[key].name === activeView){
                Object.keys(views[key].structure[structureType].models).map((modelID) => {
                    if (views[key].structure[structureType].models[modelID].id === id) {
                        Object.keys(model).map((item) => {
                            views[key].structure[structureType].models[modelID][item] = model[item];
                        })
                    }
                })
            }
        })

        window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
    }

}

export function getChartForm() {
    return controls.chart.form
}

export function getChartSchema() {
    return controls.chart.schema
}

export function getViews() {
    return views
}

export function getControls() {
    return controls
}

export function controlModel(schema, model) {
    const valid = ajv.validate(schema, model)
    let r;
    if (valid) {
        r = {
            isValid: true,
        }
    } else {
        r = {
            isValid: false, data: ajv.errors
        }
    }
    return r
}

export async function deleteModel(activeView, structureType, id) {
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            if (views[key].structure[structureType].models[id] !== undefined) {
                views[key].structure[structureType].models.splice(id, 1);
                window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
            }
        }
    })
}

export async function getModelToUpdate(activeView, structureType, id) {
    Object.keys(views).map((key) => {
        if(views[key].name === activeView){
            if (views[key].structure[structureType].models[id] !== undefined) {
                return {
                    errors: false, data: {
                        results: views[key].structure[structureType].models[id]
                    }
                }
            } else {
                return {
                    errors: true, data: null
                }
            }
        }
    })

}



