# X-BI

X-BI is a platform allowing access, interaction and personalization of BI information for a better dashboard
configuration.

![presentation](public/img/documentation/presentation.gif)

## Tech / Framework used

Project is created with:
> - Vue.js
> - JsonSchema
> - Storybook

## Getting Started

This project uses ```vue.js``` for build user interfaces, ```yarn``` as the dependency manager, ```storybook``` for
component testing.
X-BI uses yarn commands, but npm will also work. You can compare yarn and npm commands in the yarn docs.

#### 1. Install dependencies

Install X-BI using yarn, open your command prompt from the main directory of the clone directory and write this command:
> yarn install

#### 2. Connect API to X-BI

To use x-bi you will need an api. The API serves as a communication interface between the components, you need a data
source to power x-bi. For the example, you can use
the **[rating-operator](https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api)**
or **[X-BI-test-data API](https://git.rnd.alterway.fr/overboard/x-bi/x-bi-test-data)**

#### How to configure api information in x-bi?

Open ```src/uiConfiguration.js``` file, look for ```apiInfo``` properties if you can't find it, you need to create it
and follow this example to fill the api information:

```
"apiInfo": {
    "url": "http://localhost:5012/",
    "login": "http://localhost:5012/login_user",
    "logout": "http://localhost:5012/login_user",
    "password": "http://localhost:5012/password",
    "redirectAfterLogin": "/",
    "redirectAfterLogout": "/login",
    "mode": "default"
  }
```

If you want to use rating operator api, you will need to change mode ```default``` to ```ro```

#### 3. run X-BI

> Run the project using yan ```yarn serve```, the project will be launched on http://localhost:8080
>
>For component testing used ```yarn storybook```, the project will be launched on http://localhost:6006
>
>Alternatively, you can build the project in static directory for production : ```yarn build```

- #### Home page

![home](public/img/documentation/home.png)

- #### Monitoring Chart

![monitoring](public/img/documentation/monitoring.gif)

#### 4. configuration of dashboard

The configuration of your own dashboard is possible. There are ```two types``` of
configuration : ```on user interface``` and ```in configuration file```

#### 4.1 On the configuration page

- ##### 4.1.1 Add a view

Go to ```views configuration``` page and follow this example to add your view

![](public/img/documentation/createView.gif)

- ##### 4.1.2 View structure

A view is structured in three fields:
> - Select button
> - Cards
> - Charts

To configure the structure go to view list in ```views configuration``` page, then in the list click on the
button ```structure``` of the view you want of a view that you want to configure. Once on the structure page, you will
see the view structures table and click on the top right button ``` Add ... ``` on the table of elements you want to add
and fill the requested information.

- ##### 4.1.2.1 Add Select button

![](public/img/documentation/createSelectButton.gif)

- ##### 4.1.2.2 Add Card

![](public/img/documentation/createCard.gif)

- ##### 4.1.2.3 Add Chart

![](public/img/documentation/createChart.gif)

- ##### 4.1.3 Edit view or structure

To edit an element, whether it is a view or its structure (selection, map, graphic), click on the edit button of the
element line to be edited, then edit the values that you want and save.

- ##### 4.1.4 delete a view structure

To delete an element, whether it is a view or its structure (selection, map, graphic), click on the delete button of the
element line to be deleted, Then you validate or not your action.

##### Note : You may get errors if the value does not respect the checks defined in the configuration files.

#### 4.2 In the configuration file

In json configuration file you have properties:
> - ```apiInfo``` : in apiInfo you have properties allowing you to connect authentication information to your api
> - ```forms``` : in forms, you have many items, in each you have form fields which corresponds to the form schema of
    vue-formulate form
> - ```views``` : in views, you have statics (don't modify it if you don't understand all x-bi code) and dynamics
    fields.
> - ```xBiInfo``` : in xBiInfo, you have x-bi information

##### Prerequisites

> - Know **[json syntax](https://jsonformatter.curiousconcept.com)**
> - Know **[vue-formulate](https://vueformulate.com)** schema form

- ##### 4.2.1 Configuration forms

Go to properties forms in ```src/uiConfiguration.json``` you will see many items : ```view```, ```select```, ```card```
, ```chart```, ```...``` and add or edit your own configuration

##### **Conditional fields configuration** :

First, add item which contains the ```condition``` property to the form, this example based on select button form :

``` 
 {
   "component": "FormulateInput",
   "type": "select",
   "name": "type",
   "placeholder": "Select type",
   "options": {
     "date": "Date",
     "dynamic": "Dynamic",
     "group": "Group"
   },
   "validation": "required",
   "condition": true
}
```

Second, add fields with contains conditionField. ConditionField must contain properties :
> - ```name``` which must be the name of the field that condition it. Here it's `type`, and
> - ```values``` add the values for the condition
> - ```validation``` see **[vue-formulate](https://vueformulate.com)** documentation to understand and fill the
    validation value

``` 
{
  "component": "FormulateInput",
  "type": "text",
  "name": "query",
  "placeholder": "Enter query link",
  "conditionFields": {
    "name": "type",
    "values": [
      "dynamic"
    ],
    "validation": "required|min:1,length"
  }
}, 
{
  "component": "FormulateInput",
  "type": "select",
  "name": "default_data",
  "placeholder": "Select default data",
  "options": {
    "hour": "hour",
    "day": "day",
    "month": "month",
    "year": "year"
  },
  "conditionFields": {
    "name": "type",
    "values": [
      "group"
    ],
    "validation": "required"
  }
} 
```

##### **Dynamic select options configuration** :

Just add the optionsData property and add your api link to it which returns the options values and the id of the item to
display (example data:
``` data: [{"name": "example1", "value":"value1},{"name": "example2", "value": "value2"}]```)

```
{
 "component": "FormulateInput",
 "type": "select",
 "name": "template_name",
 "placeholder": "Select template name",
 "options": {},
 "optionsData": {
   "url": "http://localhost:5012/options",
   "id": "name"
 },
 "validation": "required"
}
  ```

- ##### 4.2.2 Configuration view structure
    - ##### 4.2.2.1 Add a model

In configuration files, adding a view model and its structure is done in dynamic views. Let's add a new model named
example and configure its structure.
In Json file Go To ``` views > dynamics > ``` and add a new field in the items.

```
{
  "views": {
    "dynamics": [
      {
        "name": "Example1",
        "path": "/",
        "icon": "fa-house-chimney-window",
        "description": "Description of example one",
        "display": true,
        "displayInMenu": true,
        "requiresAuth": true,
        "structure": {...}
      },
      ...
    ]
  }
}
```

To know the expected variables in the models, their importance and their data types, validations ...
You have to go to the forms look properties depending on the models either card charts views or select.

- ##### 4.2.2.2 Delete model

To delete a model of select, chart or card, simply delete a field from its models in the dynamics views structure.
Go to 
> - `views > synamics > viewName > structure > select > models`
> - `views > synamics > viewName > structure > chart > models`
> - `views > synamics > viewName > structure > card > models`

and delete one field.

## Contribute

Simply open a pull request over the repository to describe your changes.

## Credits

- Rnd Team @ Alter Way,
- Koku Ulrich GBLOKPO @koku-ulrich.gblokpo,
- Jonathan Rivalan (author) @JonRiv.

## License

Licensed under the Apache 2.0 license.
