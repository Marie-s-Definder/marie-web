# Marie-E Web

> A frontend project using [Angular](https://angular.io) with [AntDesign](https://ng.ant.design)

## Learning Curve

1. HTML
    * https://www.w3schools.com/html
    * https://web.dev/learn/html
1. CSS
    * https://www.w3schools.com/css
    * https://web.dev/learn/css
1. JavaScript
    * https://www.w3schools.com/js
    * https://developer.mozilla.org/en-US/docs/Learn/JavaScript
    * https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web
1. Typescript
    * https://www.typescriptlang.org
    * https://www.w3schools.com/typescript
1. Node.js
    * https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
    * https://www.w3schools.com/nodejs
1. Angular
    * https://angular.io/tutorial
    * https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Angular_getting_started

## Dev Environment

### Software
* [Node.js](https://nodejs.org) `v21.7.1` with `npm@10.5.0`
* [VS Code](https://code.visualstudio.com) with recommended extensions

### Hardware
* HkVision IPC with `basic/digest` auth enabled

## Dev Procedure

1. Get Dependencies
    ```
    $ npm install
    ```
1. Start Dev
    ```
    $ npm start
    ```
1. Build Artifacts and Run
    ```
    $ docker build -t mariee-web:latest .
    $ docker run -d --name mariee-web -p 80:80 mariee-web:latest
    ```

## TODO
1. Get `Area` and `Droid` info from backend service now they are hard coded in a json file
1. Manage `Area` and `Droid` by `Create`/`Read`/`Update`/`Delete` with backend service
1. `Preset` functionality
1. `Droid` control functionality
1. Login page
1. Beautify...
