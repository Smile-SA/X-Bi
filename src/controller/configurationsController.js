import * as uiConf from "../settings/uiConfigurations.json"

var uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'))
if (uiConfigurations === null) {
    uiConfigurations = uiConf
}
if (uiConfigurations.default !== undefined) {
    uiConfigurations = uiConfigurations.default;
}

var dynamics = uiConfigurations.views.dynamic;
var statics = uiConfigurations.views.static;
var controls = uiConfigurations.controls;
const Ajv = require("ajv");
const ajv = new Ajv();

export function getConfig() {
    return uiConfigurations;
}

export function getStructure(activeView) {
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.card;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.card.models;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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

export function getSelectModels(activeView) {
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.select.models;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.card.styles;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    if (r !== undefined && r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.chart;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.chart.models;
        }
    })
    if (r!=null || r!=undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
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

export async function addModel(model, structureType, activeView) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        await Object.keys(dynamics).map((key) => {
            if (dynamics[key].name === activeView) {
                dynamics[key].structure[structureType].models.push(model);
                save();

            }
        })
    }
}

export async function addDynamicView(model, structureType) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        await dynamics.push(model);
        await save();
    }
}

export function save() {
    window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
    uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'));
}

export async function updateModel(model, id, structureType, activeView) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        await Object.keys(dynamics).map((key) => {
            if (dynamics[key].name === activeView) {
                Object.keys(dynamics[key].structure[structureType].models).map((modelID) => {
                    if (dynamics[key].structure[structureType].models[modelID].id === id) {
                        Object.keys(model).map((item) => {
                            dynamics[key].structure[structureType].models[modelID][item] = model[item];
                        })
                    }
                })
            }
        })
    }
    save();
}

export async function updateDynamicView(model, viewName, structureType) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        await Object.keys(dynamics).map((key) => {
            if (dynamics[key].name === viewName) {
                Object.keys(dynamics[key]).map((modelID) => {
                    if (model[modelID] != undefined) {
                        dynamics[key][modelID] = model[modelID];
                        save();
                    }
                })
            }
        })
    }
}

export function getChartForm() {
    return controls.chart.form
}

export function getChartSchema() {
    return controls.chart.schema
}

export function getDynamicViews() {
    if (Object.keys(dynamics).length > 0) {
        return {
            errors: false, data: {
                total: Object.keys(dynamics).length, results: dynamics
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
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
        if (dynamics[key].name === activeView) {
            if (dynamics[key].structure[structureType].models[id] !== undefined) {
                dynamics[key].structure[structureType].models.splice(id, 1);
                save();
            }
        }
    })
}

export async function deleteDynamicsViews(activeViewName) {
    let i = 0;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeViewName) {
            dynamics.splice(i, 1);
            save();
        }
        i += 1;
    })
}

export async function getModelToUpdate(activeView, structureType, id) {
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
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

export function getMenus() {
    let data = []
    Object.keys(dynamics).map((item) => {
        if (dynamics[item].display === true) {
            if (dynamics[item].displayInMenu === true) {
                data.push(dynamics[item])
            }
        }
    });
    Object.keys(statics).map((item) => {
        if (statics[item].display === true) {
            if (statics[item].displayInMenu === true) {
                data.push(statics[item])
            }
        }
    });
    return data
}

export async function setDynamicViewProperty(name, value, property) {
    await Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === name) {
            dynamics[key][property] = value;
            save();
        }
    })
}

