# X-BI
X-BI allows its users to access BI informations they can customise and interact with.

![presentation](public/images/documentation/presentation.gif "presentation")

### Tech / Framework used
Project is created with:
```
 - Vue.js
 - Storybook
```

### Before installation X-BI install your API

    Api is used as the communication interface between the components, you need a data source to feed x-bi
    For the example you can use the rating-operator API, follow this link to install it : https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api

Note: X-BI uses yarn commands, but npm will also work. You can compare yarn and npm commands in the yarn docs.

## Getting Started
### 1 - Access project file
There are three ways to access the project file on git :
```
- Clone with SSH (link : https://git@git.rnd.alterway.fr:overboard/5gbiller/rating-operator-api.git)
- Clone with HTTPS (link : https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api.git)
- Or download on git (link : https://git.rnd.alterway.fr/overboard/5gbiller/rating-operator-api)
```

### 2 - Install dependencies
Install X-BI using yarn, open your command prompt from the main directory of the clone directory and write this command :
```
yarn install
```

### 3 - Connect API to X-BI
Open the file ```src/settings/variables.js```, in the function ```generateAPIUrl``` at line 3 you can set your api url,
by default you have a ```http://localhost:5012```.
![generateAPIUrl](public/images/documentation/generateAPIUrl.png "generateAPIUrl")

### 4 - run X-BI
Run the project use yan :
``` 
yarn serve 
```
Alternatively, you can build the project in static directory for production :
``` 
yarn build 
```
## You just successfully run X-BI!
```
The project is launched by default on http://localhost:8080
```
### Connexion page
![connexion](public/images/documentation/connexion.png "connexion")

### Home page
![home](public/images/documentation/home.png "home")

### Monitoring Page
![monitoring](public/images/documentation/monitoring.gif "monitoring")

## Contribute
Simply open a pull request over the repository to describe your changes.

## Credits
- Rnd Team @ Alter Way
- Koku Ulrich GBLOKPO @koku-ulrich.gblokpo
- Jonathan Rivalan (author) @JonRiv

## License


Licensed under the Apache 2.0 license.