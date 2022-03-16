import * as routes from "@/router/routerConfiguration.json"

export function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/${view}`)
}

export function getChildrenRoutes() {
    let data = []
    let children = routes.children;
    Object.keys(children).map((item) => {
        if (children[item].children !== undefined) {
            Object.keys(children[item].children).map((subItem) => {
                if (children[item].children[subItem].display === true) {
                    data.push({
                        path: children[item].children[subItem].path,
                        alias: children[item].children[subItem].alias,
                        component: loadView(children[item].children[subItem].component),
                        name: children[item].children[subItem].name,
                        meta: {
                            description: children[item].children[subItem].description,
                            requiresAuth: children[item].children[subItem].requiresAuth,
                            icon: children[item].children[subItem].icon
                        },
                    })
                }
            });
        } else {
            if (children[item].display === true) {
                data.push({
                    path: children[item].path,
                    alias: children[item].alias,
                    component: loadView(children[item].component),
                    name: children[item].name,
                    meta: {description: children[item].description, requiresAuth: children[item].requiresAuth,
                        icon: children[item].icon

                    },
                })
            }
        }

    });
    return data
}

export function getChildren() {
    let data = [];
    let children = routes.children;
    Object.keys(children).map((item) => {
        if (children[item].children) {
            Object.keys(children[item].children).map((subItem) => {
                if (children[item].children[subItem].display === true) {
                    data.push(children[item].children[subItem])
                }
            });
        } else {
            if (children[item].display === true) {
                data.push(children[item])
            }
        }
    });
    return data;
}

export function setJsonData() {
    return routes
}

export function getJsonData() {
    return routes
}

export function setDisplay(id, displayValue) {
    console.log(id + displayValue)


}

export function getDefaultRoutes() {
    return routes.default.default
}

export function getMenus() {
    let data = []
    let children = routes.children;
    Object.keys(children).map((item) => {
        if (children[item].displayInMenu === true) {
            data.push(children[item])
        }
    });
    return data
}
