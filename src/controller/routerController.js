import * as controller from "../controller/configurationsController.js"

let conf = controller.getConfig();

export function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `../${view}`)
}

export function getChildrenRoutes() {
    let data = []
    let dynamics = conf.views.dynamics;
    let statics = conf.views.statics;
    Object.keys(dynamics).map((item) => {
        if (dynamics[item].display === true) {
            data.push({
                path: dynamics[item].path,
                components: {content: loadView('views/dynamic/index')},
                name: dynamics[item].name,
                props: {content: true},
                meta: {
                    description: dynamics[item].description,
                    requiresAuth: dynamics[item].requiresAuth,
                    icon: dynamics[item].icon
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
                        components: {content: loadView(statics[item].children[subItem].component)},
                        props: {content: true},
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
                    components: {content: loadView(statics[item].component)},
                    props: {content: true},
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

export function getDefaultRoutes() {
    return conf.views.default
}

