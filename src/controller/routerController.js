import * as controller from "../controller/configurationsController.js"
let conf = controller.getConfig();
let dynamicViews
if(conf.views.dynamic!=undefined){
    dynamicViews = conf.views.dynamic
}
export function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../${view}`)
}

export function getChildrenRoutes() {
    let data = []
    let dynamic = conf.views.dynamic;
    let statics = conf.views.static;
    Object.keys(dynamic).map((item) => {
        if (dynamic[item].display === true) {
            data.push({
                path:dynamic[item].path,
                component: loadView(dynamic[item].component),
                name: dynamic[item].name,
                meta: {
                    description: dynamic[item].description,
                    requiresAuth: dynamic[item].requiresAuth,
                    icon: dynamic[item].icon
                },
            })
        }
    });
    Object.keys(statics).map((item) => {
        if (statics[item].children !== undefined) {
            Object.keys(statics[item].children).map((subItem) => {
                if (statics[item].children[subItem].display === true) {
                    data.push({
                        path: statics[item].children[subItem].path,
                        component: loadView(statics[item].children[subItem].component),
                        name: statics[item].children[subItem].name,
                        meta: {
                            description: statics[item].children[subItem].description,
                            requiresAuth: statics[item].children[subItem].requiresAuth,
                            icon: statics[item].children[subItem].icon
                        },
                    })
                }
            });
        } else {
            if (statics[item].display === true) {
                data.push({
                    path: statics[item].path,
                    component: loadView(statics[item].component),
                    name: statics[item].name,
                    meta: {
                        description: statics[item].description,
                        requiresAuth: statics[item].requiresAuth,
                        icon: statics[item].icon
                    },
                })
            }
        }

    });
    return data
}

export function getHomeInConf() {
    let views = conf.views;
    Object.keys(views).map((item) => {
        if (views[item].isHomePage === true) {
            if (views[item].display === true) {
                return {
                    path: views[item].path,
                    component: loadView(views[item].component),
                    name: (views[item].name).replaceAll(' ',""),
                    meta: {
                        description: views[item].description,
                        requiresAuth: views[item].requiresAuth,
                        icon: views[item].icon
                    },
                }
            }
        }
    });
}

export function getChildren() {
    let data = [];
    let children = conf.views.dynamic;
    Object.keys(children).map((item) => {
        if (children[item].children) {
            Object.keys(children[item].children).map((subItem) => {
                    data.push(children[item].children[subItem])
            });
        } else {
                data.push(children[item])
        }
    });
    return data;
}

export async function setDynamicViewProperty(name,value,property) {
    await Object.keys(dynamicViews).map((key) => {
        if(dynamicViews[key].name === name){
            dynamicViews[key][property]=value;
            controller.save();
        }
    })
}

export function getDefaultRoutes() {
    return conf.views.default
}

export function getMenus() {
    let data = []
    let dynamic = conf.views.dynamic;
    let statics = conf.views.static;
    Object.keys(dynamic).map((item) => {
        if (dynamic[item].display === true) {
            if (dynamic[item].displayInMenu === true) {
                data.push(dynamic[item])
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