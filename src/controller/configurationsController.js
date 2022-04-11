import * as uiConf from "../settings/uiConfigurations.json"

var uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'))
if(uiConfigurations === null){
    uiConfigurations = uiConf
}
if (uiConfigurations.default !== undefined) {
    uiConfigurations = uiConfigurations.default;
}
var dynamics = uiConfigurations.views.dynamic;
var controls = uiConfigurations.controls;
const Ajv = require("ajv");
const ajv = new Ajv();

export function getConfig() {
    return uiConfigurations;
}

export function getStructure(activeView) {
    let r ;
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            r = dynamics[key].structure;
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
             r = dynamics[key].structure.card;
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            r = dynamics[key].structure.card.models;
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            r = dynamics[key].structure.card.styles;
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            r = dynamics[key].structure.chart;
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            r = dynamics[key].structure.chart.models;
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            r = dynamics[key].structure.chart.styles;
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
        Object.keys(dynamics).map((key) => {
            if(dynamics[key].name === activeView){
                dynamics[key].structure[structureType].models.push(model);
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
        await Object.keys(dynamics).map((key) => {
            if(dynamics[key].name === activeView){
                Object.keys(dynamics[key].structure[structureType].models).map((modelID) => {
                    if (dynamics[key].structure[structureType].models[modelID].id === id) {
                        Object.keys(model).map((item) => {
                            dynamics[key].structure[structureType].models[modelID][item] = model[item];
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

export function getdynamics() {
    return dynamics
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
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            if (dynamics[key].structure[structureType].models[id] !== undefined) {
                dynamics[key].structure[structureType].models.splice(id, 1);
                window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
            }
        }
    })
}

export async function deleteDynamicsViews(activeViewName) {
    let i=0;
    Object.keys(dynamics).map((key) => {
            if(dynamics[key].name === activeViewName){
                dynamics.splice(i, 1);
                this.save();
            }
            i+=1;
    })
}

export async function getModelToUpdate(activeView, structureType, id) {
    Object.keys(dynamics).map((key) => {
        if(dynamics[key].name === activeView){
            if (dynamics[key].structure[structureType].models[id] !== undefined) {
                return {
                    errors: false, data: {
                        results: dynamics[key].structure[structureType].models[id]
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



