const util = require('util');
const generator = require('yeoman-generator');
const generatorBase = require('../generator-base');
const chalk = require('chalk');
const _ = require('lodash');
const prompts = require('./prompts');
const writeAngularFiles = require('./files-angular').writeFiles;
const packagejs = require('../../package.json');
const constants = require('../generator-constants');

const JBHuntUIGenerator = generator.extend({});

util.inherits(JBHuntUIGenerator, generatorBase);

/* Constants used throughout */
const QUESTIONS = constants.CLIENT_QUESTIONS;

module.exports = JBHuntUIGenerator.extend({
  constructor: function (...args) { // eslint-disable-line object-shorthand
    generator.apply(this, args);
    this.configOptions = this.options.configOptions || {};
    this.testFrameworks = [];
    this.testFrameworks.push('protractor');
    this.configOptions.buildTool === 'maven';
    this.currentQuestion = this.configOptions.lastQuestion ? this.configOptions.lastQuestion : 0;
    this.totalQuestions = this.configOptions.totalQuestions ? this.configOptions.totalQuestions : QUESTIONS;
    this.baseName = this.configOptions.baseName;
    this.logo = this.configOptions.logo;
    this.useYarn = false;
    this.clientPackageManager = 'npm';
    this.isDebugEnabled = this.configOptions.isDebugEnabled || this.options.debug;
  },

  initializing: {
    displayClientLogo() {
        this.printClientGeneratorLogo();
    },

    setupClientconsts() {
      // Make constants available in templates
      this.MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
      this.serverPort = this.config.get('serverPort') || this.configOptions.serverPort || 8080;
      this.applicationType = this.config.get('applicationType') || this.configOptions.applicationType;
      if (!this.applicationType) {
        this.applicationType = 'monolith';
      }
      this.clientFramework = 'angular2';
      this.useSass = true;
      this.packagejs = packagejs;
      const baseName = this.config.get('baseName');
      if (baseName) {
        this.baseName = baseName;
      }
      const clientConfigFound = this.useSass !== undefined;
      if (clientConfigFound) {
        this.existingProject = true;
      }
      if (!this.clientPackageManager) {
          this.clientPackageManager = 'npm';
        }
      }
  },

  prompting: {
    askForApplicationTitle: prompts.askForApplicationTitle,

    setSharedConfigOptions() {
      this.configOptions.lastQuestion = this.currentQuestion;
      this.configOptions.totalQuestions = this.totalQuestions;
      this.configOptions.clientFramework = this.clientFramework;
      this.configOptions.useSass = this.useSass;
    },

    saveConfig(){
      this.config.set('appTitle', this.appTitle);
    }
  },

  configuring: {
    configureGlobal() {
      // Application name modified, using each technology's conventions
      this.camelizedBaseName = _.camelCase(this.baseName);
      this.angular2AppName = this.getAngular2AppName();
      this.capitalizedBaseName = _.upperFirst(this.baseName);
      this.dasherizedBaseName = _.kebabCase(this.baseName);
      this.lowercaseBaseName = this.baseName.toLowerCase();
      if (!this.nativeLanguage) {
        // set to english when translation is set to false
        this.nativeLanguage = 'en';
      }
    },

    saveConfig() {
      this.config.set('clientFramework', this.clientFramework);
      this.config.set('useSass', this.useSass);
      this.config.set('clientPackageManager', this.clientPackageManager);
    }
  },

  default: {

    getSharedConfigOptions() {
      if (this.configOptions.clientFramework) {
        this.clientFramework = this.configOptions.clientFramework;
      }

      if (this.configOptions.testFrameworks) {
        this.testFrameworks = this.configOptions.testFrameworks;
      }

      this.protractorTests = this.testFrameworks.indexOf('protractor') !== -1;

      // Make dist dir available in templates
      this.BUILD_DIR = 'target/';
      this.DIST_DIR = this.BUILD_DIR + constants.CLIENT_DIST_DIR;
    }
  },

  writing() {
    return writeAngularFiles.call(this);
  },

  install() {
    this.installDependencies({
      bower: false,
      npm: true,
      yarn: false,
      callback: function () {}
    });
  },

  end() {
    this.log(chalk.green.bold('\n'+'Client generated successfully.'+'\n'));
  }
});
