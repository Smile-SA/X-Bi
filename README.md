# X-BI
X-BI allows its users to access BI informations they can customise and interact with.

## Tech/framework used
Project is created with:
```
 - Vue.js
 - Storybook
```
## X-BI installation steps

### Before installation X-BI install your API
    Api is used as the communication interface between the components, you need a data source to feed x-bi
    For the example you can use the rating-operator API, follow this link to install it : https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api


### 1 - Access project file
There are three ways to access the project file on git :
```
- Clone with SSH (link : git@git.rnd.alterway.fr:overboard/5gbiller/rating-operator-api.git)
- Clone with HTTPS (link : https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api.git)
- Or download on git (link : https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api)
```

### 2 - Install dependencies
Open a command prompt from the main directory of the clone folder and write this command
```
yarn install
```

### 3 - Connect API to X-BI
Open the file ```src/settings/variables.js```, in the function ```generateAPIUrl``` at line 3 you can set your api url, by default you have a ```http://localhost:5012```
```
![](public/images/documentation/generateAPIUrl.png)
```

### 4 - run the project 
```
yarn serve
```

Alternatively, you can build the project in static directory for production :
```
yarn build
```


