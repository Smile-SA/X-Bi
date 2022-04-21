import * as controller from "../controller/configurationsController.js"

let conf = controller.getConfig();

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
                path: dynamic[item].path,
                components: {content : loadView(dynamic[item].component)},
                name: dynamic[item].name,
                props: { content: true},
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
                        components: {content : loadView(statics[item].children[subItem].component)},
                        props: { content: true},
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
                    components: {content : loadView(statics[item].component)},
                    props: { content: true},
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

