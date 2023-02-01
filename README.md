# ihsa_frontend

## Project setup
___
### Node and NPM setup
First, make sure you have the correct node and npm versions(Not completely neccesary. However, difference with some versions may cause issues later). You can check this by running
```
npm --version
```
```
node --version
```
npm version should be 6.14.15. You can modify npm version by running following command: ```npm install -g npm@6.14.15```
node version should be 14.18.1 This is a little more complicated. In order to switch node versions you should Install NVM, you can google how to do this.
Once NVM is installed you can switch to the correct node version by running: 
```
nvm install 14.18.1
nvm use 14.18.1
```  
___
### Vue and other packages
Once you have the correct versions of NPM and NODE, you can run the following commandas to install vue and all the other project dependencies:
Install vue
```
npm install vue
```
Install project dependencies
```
npm install
```
<br>

## Starting your local environment
___
### Compiles and hot-reloads for development. You will use this command the most since this is what runs the application on your local environment and allows you to see changes in real time.
```
npm run serve
```

## Do not worry too much about these commands. They are used to build the final application once it's ready for deployment
### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
