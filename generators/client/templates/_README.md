

# AppMasterdataAccount

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.24.

## Project INIT

### Prerequisite 
1.  verify that you are running node version 3.9.1 `node -v`.
2.  verify that you are running npm version 3.9.1 `npm -v`.
3.  verify that you are running the latest angular-cli `ng -v`.
3.  In case Node is not installed, install node-v6.9.5-x64.exe
4.  Run following for angular-cli to be installed:  npm install -g angular-cli

### Run Webpack Dev Server
1.  If existing project, also run `npm install` to install packages.
2.  Start app by running `ng serve` from root of project.

### Build Steps Used to Create Project
1.  Run `ng init --sd=src/main/frontend --style=scss --routing` to add angular the project. 
2.  Run `npm install ng2-bootstrap --save` to load in the ng2-bootstrap component library.
3.  Run `npm install bootstrap-sass --save` to load in the getBootstrap base components.
4.  Run `npm install lodash --save` to load in lodash
5.  Run `npm install @types/lodash --save` to load in lodash ts typings
6.  Run `typings install lodash --save` to update typings with lodash
7.  Run `npm install simple-line-icons --save` to load in simple line icons
8.  Run `npm install font-awesome --save` to load fontawesome icons.
9.  Run `npm install rxjs` for reactive extensions.

### Build CoreModule
1. Run `ng g module core`

##### Build HeaderModule
1. Run `ng g module core/header`
2. Run `ng g component core/header`

##### Build SidebarLeftModule
1. Run `ng g module core/sidebar-left`
2. Run `ng g component core/sidebar-left`

##### Build SidebarRightModule
1. Run `ng g module core/sidebar-right`
2. Run `ng g component core/sidebar-right`

##### Build SearchModule
1. Run `ng g module core/search`
2. Run `ng g component core/search`

##### Build SharedModule
1. Run `ng g module shared`

### Build Features
1. Run `mkdir src/main/frontend/app/features`

##### Build Dashboard Feature Module w/ Routing
1. Run `ng g module features/dashboard --routing`

##### Build Account Create Module w/ Routing 
1. Run `ng g module features/account-create --routing`
##### Build Account Search Module w/ Routing 
1. Run `ng g module features/account-search --routing`

##### Build Location Create Module w/ Routing 
1. Run `ng g module features/location-create --routing`
##### Build Location Search Module w/ Routing 
1. Run `ng g module features/location-search --routing`

##### Build Warehouse Search Module w/ Routing 
1. Run `ng g module features/warehouse-search --routing`
##### Build Settings Module w/ Routing 
1. Run `ng g module features/settings --routing`



## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
