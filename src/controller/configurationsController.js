var uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'));
if (uiConfigurations.default !== undefined) {
    uiConfigurations = uiConfigurations.default;
}
var views = uiConfigurations.views;
var controls = uiConfigurations.controls;
const Ajv = require("ajv");
const ajv = new Ajv();

export function getStructure(activeView) {
    let r = views[activeView].structure;
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
    let r = views[activeView].structure.card;
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
    const r = views[activeView].structure.card.models;
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
    let r = views[activeView].structure.card.styles;
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
    let r = views[activeView].structure.chart;
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
    let r = views[activeView].structure.chart.models;
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
    let r = views[activeView].structure.chart.styles;
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
        views[activeView].structure[structureType].models.push(model);
        window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
    }
}

export async function updateModel(model, id, structureType, activeView) {
    let r = controlModel(controls[structureType].schema, model);
    if (r.isValid) {
        await Object.keys(views[activeView].structure[structureType].models).map((modelID) => {
            if (views[activeView].structure[structureType].models[modelID].id === id) {
                Object.keys(model).map((key) => {
                    views[activeView].structure[structureType].models[modelID][key] = model[key];
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
    if (views[activeView].structure[structureType].models[id] !== undefined) {
        views[activeView].structure[structureType].models.splice(id, 1);
        window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
    }
}

export async function getModelToUpdate(activeView, structureType, id) {
    if (views[activeView].structure[structureType].models[id] !== undefined) {
        return {
            errors: false, data: {
                results: views[activeView].structure[structureType].models[id]
            }
        }
    } else {
        return {
            errors: true, data: null
        }
    }
}



