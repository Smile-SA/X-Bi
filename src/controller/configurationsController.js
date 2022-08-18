import * as uiConf from "../uiConfigurations.json"

let uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'))
if (uiConfigurations === null) {
    uiConfigurations = uiConf
}
if (uiConfigurations.default !== undefined) {
    uiConfigurations = uiConfigurations.default;
}
let dynamics = uiConfigurations.views.dynamics, statics = uiConfigurations.views.statics,
    forms = uiConfigurations.forms,
    apiInfo = uiConfigurations.apiInfo,
    xBiInfo = uiConfigurations.xBiInfo
const Ajv = require("ajv"), ajv = new Ajv();

export function getDynamics(){
    return dynamics
}
export function getApiInfo(){
    return apiInfo
}
export function getXBiInfo(){
    return xBiInfo
}

export function getConfig() {
    return uiConfigurations;
}

export async function save() {
    uiConfigurations.views.dynamics = dynamics
    uiConfigurations.views.statics = statics
    await window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
    uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'))
}

export function getStructure(activeView) {
    return dynamics[activeView].structure;
}

export function getCard(activeView) {
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.card;
        }
    })
    if (r != null || r != undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    if (r != null || r != undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    if (r != null || r != undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    if (r != null || r != undefined && Object.keys(r) && Object.keys(r).length > 0) {
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

export function updateValidation(schema, model) {
    Object.keys(schema).map((key) => {
        if (schema[key].condition != undefined && schema[key].condition === true) {
            Object.keys(schema).map((id) => {
                if (schema[id].conditionFields != undefined) {
                    if (schema[id].conditionFields.name === schema[key].name) {
                        if (schema[id].conditionFields.values.includes(model[schema[key].name])) {
                            schema[id].validation = schema[id].conditionFields.validation
                        } else {
                            schema[id].validation = ''
                        }
                    }
                }
            });
        }
    });
}

export function showInputInModel(input, model) {
    return input.conditionFields ? input.conditionFields.values.includes(model[input.conditionFields.name]) ? true : false : true;
}

export function getChart(activeView) {
    let r;
    Object.keys(dynamics).map((key) => {
        if (dynamics[key].name === activeView) {
            r = dynamics[key].structure.chart;
        }
    })
    if (r != null || r != undefined && Object.keys(r) && Object.keys(r).length > 0) {
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
    if (r != null || r != undefined && Object.keys(r) && Object.keys(r).length > 0) {
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

export function addModel(structureType, model, viewId) {
    let add = false;
    if (structureType == 'view') {
        dynamics.push(model);
        add = true;
    } else {
        if (structureType !== null && viewId >= 0 && Object.keys(model).length > 0) {
            dynamics[viewId].structure[structureType].models.push(model);
            add = true;
        }
    }
    save();
    return add;
}

export function editModel(structureType, viewId, model, modelId,) {
    let update = false
    if (structureType === 'view' && dynamics[viewId] !== undefined) {
        dynamics[viewId] = model
        update = true;
    } else {
        Object.keys(model).map((item) => {
            if (dynamics[viewId].structure[structureType].models[modelId][item] != undefined) {
                dynamics[viewId].structure[structureType].models[modelId][item] = model[item];
                update = true
            }
        })
    }
    save();
    return update;
}

export function getDynamicViews() {
    return dynamics
}

export function getDefaultModel(structureType, viewId, modelId) {
    if (structureType === 'view') {
        return dynamics[viewId]
    } else {
        return dynamics[viewId].structure[structureType].models[modelId]
    }
}

export function getModel(structureType, viewId, modelId) {
    let defaultModel = getDefaultModel(structureType, viewId, modelId)
    let form = this.getForm(structureType)
    let newModel = {}
    let formIds = [];
    Object.keys(form).map((formId) => {
        formIds.push(form[formId].name)
    })
    Object.keys(defaultModel).map((defaultModelId) => {
        if (formIds.includes(defaultModelId)) {
            newModel[defaultModelId] = defaultModel[defaultModelId]
        }
    })
    return newModel
}

export function getForms() {
    return forms
}

export function getForm(structureType) {
    return forms[structureType];
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

export function deleteModel(structureType, id, viewId) {
    let deleted = false
    if (structureType === 'view') {
        if (dynamics.splice(id, 1)) {
            deleted = true
        }
    } else {
        if (dynamics[viewId].structure[structureType].models.splice(id, 1)) {
            deleted = true
        }
    }
    save();
    return deleted;
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

export async function getMenus() {
    let data = []
    await Object.keys(dynamics).map((item) => {
        if (dynamics[item].display === true) {
            if (dynamics[item].displayInMenu === true) {
                data.push(dynamics[item])
            }
        }
    });
    await Object.keys(statics).map((item) => {
        if (statics[item].display === true) {
            if (statics[item].displayInMenu === true) {
                data.push(statics[item])
            }
        }
    });
    return data
}

export async function setDynamicViewProperty(id, property, value) {
    dynamics[id][property] = value;
    await save();
}

export async function refreshDate(date, that) {

    if (date !== null && date !== undefined) {
        that.from = date.start.toISOString().split('.')[0] + '.000Z'
        if (date.end === null || date.start === date.end) {
            date.end = new Date(that.from)
            date.end.setDate(date.end.getDate() + 1)
        }
        that.to = date.end.toISOString().split('.')[0] + '.000Z'
        that.to = that.to.replace('T', ' ')
        that.from = that.from.replace('T', ' ')
    }
    that.queryData['start'] = that.from;
    that.queryData['end'] = that.to;

    let s = getCardModels(that.$route.name)
    if (s.data.errors !== true) {
        if (s.data.total > 0) {
            that.structure.card.models = s.data.results;
            let style = getCardStyles(that.$route.name)
            if (style.data.errors !== true) {
                that.structure.card.styles = style.data.results;
            }
        }
    } else {
        that.structure.card.models = {};
        that.structure.card.styles = {};
    }

    let c = getChartModels(that.$route.name)
    if (c.data.errors !== true) {
        if (c.data.total > 0) {
            that.structure.chart.models = c.data.results;
            let style = getChartStyles(that.$route.name)
            if (style.data.errors !== true) {
                that.structure.chart.styles = style.data.results;
            }
        }
    } else {
        that.structure.chart.models = {};
        that.structure.chart.styles = {};
    }

}

