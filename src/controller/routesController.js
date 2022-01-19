import * as routes from "@/router/routesConfiguration.json"
export function loadView(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/${view}`)
}


export function getChildrenRoutes(){
    let data = []
    let children = routes.children;
    Object.keys(children).map((item) => {
        if(children[item].display === true){
            data.push({
                path: children[item].path,
                alias: children[item].alias,
                component:loadView(children[item].component),
                name: children[item].name,
                meta: {description: children[item].description, requiresAuth: children[item].requiresAuth},
            })
        }
    });
    return data
}

export function getChildren(){
    let data = []
    let children = routes.children;
    Object.keys(children).map((item) => {
        if(children[item].display === true){
            data.push(children[item])
        }
    });
    return data
}

export function setJsonData(){
    return routes
}

export function getJsonData(){
    return routes
}
export function setDisplay(id,displayValue){
    console.log(id + displayValue)


}

export function getDefaultRoutes(){
    return routes.default.default
}
