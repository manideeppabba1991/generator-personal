'use strict';

const generator = require('yeoman-generator');
const generatorBase = require('../generator-base');
const prompts = require('./prompts');
const util = require('util');

const JBHuntUIGenerator = generator.extend({});

util.inherits(JBHuntUIGenerator, generatorBase);

/* Constants use throughout */
const constants = require('../generator-constants');
const QUESTIONS = constants.APP_QUESTIONS;
module.exports = JBHuntUIGenerator.extend({
  constructor: function () {
    generator.apply(this, arguments);

    this.configOptions = this.options.configOptions || {};
    this.currentQuestion = this.configOptions.lastQuestion ? this.configOptions.lastQuestion : 0;
    this.totalQuestions = this.configOptions.totalQuestions ? this.configOptions.totalQuestions : QUESTIONS;
  },
  initializing: {
    displayLogo: function () {
      this.printGeneratorLogo();
    }
  },
  prompting: {
    askForModuleName: prompts.askForModuleName,
    askForApplicationFramework: prompts.askForApplicationFramework,
    setSharedConfigOptions() {
      this.configOptions.lastQuestion = this.currentQuestion;
      this.configOptions.totalQuestions = this.totalQuestions;
    },
    saveConfig(){
      this.config.set('baseName', this.baseName);
      this.setApplicationFrameworkType(this.applicationFramework, this);
    }
  },
  configuring: {},
  default: {
    composeClient: function () {
      if(this.config.get('clientOnly')) {
        this.composeClientSub(this);
      }
    },
    composeServer: function () {
      if(this.config.get('ng-server') || this.config.get('ws_server')) {
        this.composeServerSub(this);
      }
    }
  },
  writing: function(){},
  end: {}
});



