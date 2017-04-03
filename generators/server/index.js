const util = require('util');
const generator = require('yeoman-generator');
const generatorBase = require('../generator-base');
const chalk = require('chalk');
const _ = require('lodash');
const prompts = require('./prompts');
const writeFiles = require('./files').writeFiles;
const packagejs = require('../../package.json');
const constants = require('../generator-constants');
const crypto = require('crypto');
const os = require('os');

const JBHuntUIGenerator = generator.extend({});

util.inherits(JBHuntUIGenerator, generatorBase);

/* Constants used throughout */
const QUESTIONS = constants.SERVER_QUESTIONS;

module.exports = JBHuntUIGenerator.extend({
    constructor: function (...args) { // eslint-disable-line object-shorthand
        generator.apply(this, args);
        this.configOptions = this.options.configOptions || {};
        this.testFrameworks = [];
        this.currentQuestion = this.configOptions.lastQuestion ? this.configOptions.lastQuestion : 0;
        this.totalQuestions = this.configOptions.totalQuestions ? this.configOptions.totalQuestions : QUESTIONS;
        this.logo = this.configOptions.logo;
        this.baseName = this.configOptions.baseName;
        this.clientPackageManager = 'npm';
        this.packageName = this.config.get('PACKAGE_DIR');
        this.packageFolder = constants.PACKAGE_DIR;
        this.isDebugEnabled = this.configOptions.isDebugEnabled || this.options.debug;
    },
    initializing: {
        displayServerLogo() {
            this.printServerGeneratorLogo();
        },

        setupServerconsts() {
            // Make constants available in templates
            this.MAIN_DIR = constants.MAIN_DIR;
            this.TEST_DIR = constants.TEST_DIR;
            this.CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
            this.SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
            this.SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
            this.SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
            this.NODE_VERSION = constants.NODE_VERSION;
            this.YARN_VERSION = constants.YARN_VERSION;
            this.NPM_VERSION = constants.NPM_VERSION;

            this.javaVersion = '8'; // Java version is forced to be 1.8. We keep the variable as it might be useful in the future.
            this.packagejs = packagejs;
            this.packageName = this.config.get('PACKAGE_DIR');
            this.serverPort = this.config.get('serverPort');
            if (this.serverPort === undefined) {
                this.serverPort = '8080';
            }

            this.searchEngine = false;
            this.messageBroker = false;
            this.serviceDiscoveryType = false;
            this.hibernateCache = 'no';
            this.clusteredHttpSession = false;
            this.buildTool = this.config.get('buildTool');

            this.clientFramework = this.config.get('clientFramework');
            const testFrameworks = this.config.get('testFrameworks');
            if (testFrameworks) {
                this.testFrameworks = testFrameworks;
            }

            const baseName = this.config.get('baseName');
            if (baseName) {
                // to avoid overriding name from configOptions
                this.baseName = baseName;
            }

            const serverConfigFound = this.packageName !== undefined && this.buildTool !== undefined;

            if (this.baseName !== undefined && serverConfigFound) {
                this.log(chalk.green('This is an existing project, using the configuration from your .yo-rc.json file \n' +
                    'to re-generate the project...\n'));

                this.existingProject = true;
            }
        }
    },

    prompting: {
        askForPackageName: prompts.askForPackageName,
        askForServerSideOpts: prompts.askForServerSideOpts,

        setSharedConfigOptions() {
            this.configOptions.lastQuestion = this.currentQuestion;
            this.configOptions.totalQuestions = this.totalQuestions;
            this.configOptions.packageName = this.packageName;
            this.configOptions.buildTool = this.buildTool;
            this.configOptions.serverPort = this.serverPort;

            // Make dist dir available in templates
            this.buildTool = 'maven';
            this.BUILD_DIR = 'target/';

            this.CLIENT_DIST_DIR = this.BUILD_DIR + constants.CLIENT_DIST_DIR;
            // Make documentation URL available in templates
            this.DOCUMENTATION_URL = constants.JBH_UI_GENERATOR_DOCUMENTATION_URL;
            //this.DOCUMENTATION_ARCHIVE_URL = `${constants.JHIPSTER_DOCUMENTATION_URL + constants.JHIPSTER_DOCUMENTATION_ARCHIVE_PATH}v${this.jhipsterVersion}`;
        },

        saveConfig(){
         this.config.set('buildTool','maven');
         this.config.set('PACKAGE_DIR',this.packageName);
         this.config.set('mainPackageName',this.mainPackageName);
         this.config.set('artifactId',this.artifactId);
         this.config.set('packaging',this.packaging);
        }
    },

    configuring: {
        configureGlobal() {
            // Application name modified, using each technology's conventions
            //this.angularAppName = this.getAngularAppName();
            this.camelizedBaseName = _.camelCase(this.baseName);
            this.dasherizedBaseName = _.kebabCase(this.baseName);
            this.humanizedBaseName = _.startCase(this.baseName);

            this.pkType = 'String';

            this.packageFolder = constants.PACKAGE_DIR.replace(/\./g, '/');
            this.packageName = this.config.get('PACKAGE_DIR').replace(/\./g, '/');
            this.testDir = `${constants.SERVER_TEST_SRC_DIR + this.packageFolder}/`;
            if (!this.nativeLanguage) {
                // set to english when translation is set to false
                this.nativeLanguage = 'en';
            }
        },

        saveConfig() {
            // this.config.set('jhipsterVersion', packagejs.version);
            this.config.set('baseName', this.baseName);
            this.config.set('packageName', this.packageName);
            this.config.set('packageFolder', this.packageFolder);
            this.config.set('serverPort', this.serverPort);
        }
    },

    default: {
        getSharedConfigOptions() {
            this.useSass = true;
            //TODO: implement when i18n is implemented
            if (this.configOptions.testFrameworks) {
                this.testFrameworks = this.configOptions.testFrameworks;
            }
            if (this.configOptions.clientFramework) {
                this.clientFramework = this.configOptions.clientFramework;
            }
            this.protractorTests = this.testFrameworks.indexOf('protractor') !== -1;
        }
    },

    writing: writeFiles(),

    end() {
      const generateClient = this.config.get('ng-server');
      const generateWS = this.config.get('ws_server');

      this.log(chalk.green.bold('\n'+'Server files generated successfully.'+'\n'));

      if(generateClient){
        this.composeClientSub(this);
      } else if(generateWS){
        this.composeWebServiceSub(this);
      }
    }

});
