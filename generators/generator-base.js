'use strict';
const path = require('path');
const _ = require('lodash');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const utils = require('./generator-utils');
const fs = require('fs');
const packagejs = require('../package.json');
const constants = require('./generator-constants');


module.exports = class extends Generator {


    /**
     * Print Generator Title.
     */
    printGeneratorLogo() {
      this.log("\n" +
       "   oooo     oooooooooo.           ooooo   ooooo                             .\n"+
       "   `888     `888'   `Y8b          `888'   `888'                           .o8\n"+
       "    888      888     888           888     888  oooo  oooo  ooo. .oo.   .o888oo\n"+
       "    888      888oooo888'           888ooooo888  `888  `888  `88888Y88b    888\n"+
       "    888      888    `88b           888     888   888   888   888   888    888\n"+
       "    888 .o.  888    .88P .o.       888     888   888   888   888   888    888 .\n"+
       ".o. 88P Y8P o888bood8P'  Y8P      o888o   o888o  `V88VV8P' o888o o888o     888\n"+
       " `Y888P                                                                         \n"
      );


      this.log(chalk.white.bold('https://ui.jbhunt.com/generator \n'));
        this.log(chalk.white('Welcome to the J.B. Hunt UI Generator ') + chalk.yellow('v' + packagejs.version));
        this.log(chalk.white('Documentation for creating an application: \n' + chalk.yellow('https://ui.jbhunt.com/creating-an-app/')));
        this.log(chalk.white('Application files will be generated in folder: \n' + chalk.yellow(process.cwd())));
    }

  printClientGeneratorLogo(){
    this.log("\n"+
      "  ___  __    ____  ____  _  _  ____\n"+
      " / __)(  )  (_  _)( ___)( \\( )(_  _)\n"+
      "( (__  )(__  _)(_  )__)  )  (   )(  \n"+
      " \\___)(____)(____)(____)(_)\\_) (__)\n"
  );
    }

  printServerGeneratorLogo(){
      this.log("\n"+
    "     _______. _______ .______      ____    ____  _______ .______\n"+
    "   /        ||   ____||   _  \\     \\   \\  /   / |   ____||   _  \\ \n"+
   "    \\   \\    |   __|  |      /       \\      /   |   __|  |      /    \n"+
".----)   |   |  |____ |  |\\  \\----.   \\    /    |  |____ |  |\\  \\----.\n"+
"|_______/    |_______|| _| `._____|    \\__/     |_______|| _| `._____|\n"

      );
    }

  printWebServiceGeneratorLogo(){
    this.log(chalk.green("Generating Web services files. Please be patient!"));
  }

  composeClientSub(generator){
    generator.composeWith(require.resolve('./client'));
  }

  composeServerSub(generator){
    generator.composeWith(require.resolve('./server'));
  }

  composeWebServiceSub(generator){
    generator.composeWith(require.resolve('./web-service'));
  }

  askModuleName(generator) {
    const done = generator.async();
    const defaultAppBaseName = this.getDefaultAppName();
    generator.prompt({
      type: 'input',
      name: 'baseName',
      validate: (input) => {
        if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
          return 'Your application name cannot contain special characters or a blank space';
        } else if (generator.applicationType === 'microservice' && /_/.test(input)) {
          return 'Your microservice name cannot contain underscores as this does not meet the URI spec';
        } else if (input === 'application') {
          return 'Your application name cannot be named \'application\' as this is a reserved name for Spring Boot';
        }
        return true;
      },
      message: response => this.getNumberedQuestion('What is the base name of your application?', true),
      default: defaultAppBaseName
    }).then((prompt) => {
      generator.baseName = prompt.baseName;
      done();
    });
  }

  getDefaultAppName() {
    return (/^[a-zA-Z0-9_]+$/.test(path.basename(process.cwd()))) ? path.basename(process.cwd()) : 'JBApp';
  }

  getNumberedQuestion(msg, cond) {
    if (cond) {
      ++this.currentQuestion;
    }
    return `(${this.currentQuestion}/${this.totalQuestions}) ${msg}`;
  }

  getAngular2AppName() {
    return _.upperFirst(_.camelCase(this.baseName, true));
  }

  writeFilesToDisk(files, generator, returnFiles, prefix) {
    const _this = generator || this;
    const filesOut = [];
    const startTime = new Date();
    // using the fastest method for iterations
    for (let i = 0, blocks = Object.keys(files); i < blocks.length; i++) {
      for (let j = 0, blockTemplates = files[blocks[i]]; j < blockTemplates.length; j++) {
        const blockTemplate = blockTemplates[j];
        if (!blockTemplate.condition || blockTemplate.condition(_this)) {
          const path = blockTemplate.path ? blockTemplate.path : '';
          blockTemplate.templates.forEach((templateObj) => {
            let templatePath = path;
            let method = 'template';
            let useTemplate = false;
            let options = {};
            let templatePathTo;
            if (typeof templateObj === 'string') {
              templatePath += templateObj;
            } else {
              templatePath += templateObj.file;
              method = templateObj.method ? templateObj.method : method;
              useTemplate = templateObj.template ? templateObj.template : useTemplate;
              options = templateObj.options ? templateObj.options : options;
            }
            if (templateObj && templateObj.renameTo) {
              templatePathTo = path + templateObj.renameTo(_this);
            } else {
              templatePathTo = templatePath.replace(/([/])_|^_/, '$1');
            }
            filesOut.push(templatePathTo);
            if (!returnFiles) {
              const templatePathFrom = prefix ? `${prefix}/${templatePath}` : templatePath;
              if (_this[method])
              _this[method](templatePathFrom, templatePathTo, _this, options, useTemplate);
            }
          });
        }
      }
    }
    if (this.isDebugEnabled) {
      this.debug(`Time taken to write files: ${new Date() - startTime}ms`);
    }
    return filesOut;
  }

  template(source, destination, generator, options = {}, context) {
    const _this = generator || this;
    const _context = context || _this;
    const fileExtension = source.split(".");
    const lastEl = fileExtension[fileExtension.length - 1].toString().toLowerCase();
    const extensions = ["eot","ttf","woff","woff2","svg","otf","png","jpg","jpeg"];
    const isExcluded = extensions.indexOf(lastEl) > -1;

    if( isExcluded ){
       this.copy(source,destination);
    } else {
       utils.renderContent(source, _this, _context, options, (res) => {
         _this.fs.write(_this.destinationPath(destination), res);
       });
    }
  }

  error(msg) {
    this.env.error(`${chalk.red.bold('ERROR!')} ${msg}`);
  }

  copyTemplate(source, dest, action, generator, opt = {}, template) {
    const _this = generator || this;
    let regex;
    switch (action) {
      case 'stripHtml' :
        regex = new RegExp([
          /( (data-t|jhiT)ranslate="([a-zA-Z0-9 +{}'](\.)?)+")/,                    // data-translate or jhiTranslate
          /( translate(-v|V)alues="\{([a-zA-Z]|\d|:|\{|\}|\[|\]|-|'|\s|\.)*?\}")/,    // translate-values or translateValues
          /( translate-compile)/,                                                         // translate-compile
          /( translate-value-max="[0-9{}()|]*")/,                                   // translate-value-max
        ].map(r => r.source).join('|'), 'g');

        utils.copyWebResource(source, dest, regex, 'html', _this, opt, template);
        break;
      case 'stripJs' :
        regex = new RegExp([
          /(,[\s]*(resolve):[\s]*[{][\s]*(translatePartialLoader)['a-zA-Z0-9$,(){.<%=\->;\s:[]]*(;[\s]*\}\][\s]*\}))/, // ng1 resolve block
          /([\s]import\s\{\s?JhiLanguageService\s?\}\sfrom\s["|']ng-jhipster["|'];)/,       // ng2 import jhiLanguageService
          /(,?\s?JhiLanguageService,?\s?)/,                                                          // ng2 import jhiLanguageService
          /(private\s[a-zA-Z0-9]*(L|l)anguageService\s?:\s?JhiLanguageService\s?,*[\s]*)/,          // ng2 jhiLanguageService constructor argument
          /(this\.[a-zA-Z0-9]*(L|l)anguageService\.setLocations\(\[['"a-zA-Z0-9\-_,\s]+\]\);[\s]*)/, // jhiLanguageService invocations
        ].map(r => r.source).join('|'), 'g');

        utils.copyWebResource(source, dest, regex, 'js', _this, opt, template);
        break;
      case 'copy' :
        _this.copy(source, dest);
        break;
      default:
        _this.template(source, dest, _this, opt);
    }
  }

  processHtml(source, dest, generator, opt, template) {
    this.copyTemplate(source, dest, 'stripHtml', generator, opt, template);
  }

  processJs(source, dest, generator, opt, template) {
    this.copyTemplate(source, dest, 'stripJs', generator, opt, template);
  }

  processPropsFile(source, dest, generator, opt, template) {
    const props = Object.keys(opt);
    let options = {};
    if(props.length){
     props.forEach((key)=> {
        const isConfig = opt[key].config;
        const config = isConfig ? generator.config.get(opt[key]['configName']) : false;
        options[key] = (isConfig) ? config : opt[key];
      });
    }
    this.fs.copyTpl(this.templatePath(source),  this.destinationPath(dest), options);
  }

  /**
   * Utility function to copy files.
   *
   * @param {string} source - Original file.
   * @param {string} destination - The resulting file.
   */
  copy(source, destination) {
    this.fs.copy(this.templatePath(source), this.destinationPath(destination));
  }

  /**
   * get the angular 2 app name for the app.
   */
  getAngular2AppName() {
    return _.upperFirst(_.camelCase(this.baseName, true));
  }

  /**
   * get the java main class name.
   */
  getMainClassName() {
    const main = _.upperFirst(this.getAngularAppName());
    const acceptableForJava = new RegExp('^[A-Z][a-zA-Z0-9_]*$');

    return acceptableForJava.test(main) ? main : 'Application';
  }

  setApplicationFrameworkType(value, generator) {
      if(value === 'client') this.setAppFrameWorkValues(generator, true, false, false);
      else if(value === 'server+client') this.setAppFrameWorkValues(generator, false, true, false);
      else if(value === 'server+webservice') this.setAppFrameWorkValues(generator, false, false, true);
  }

  setAppFrameWorkValues(generator, clientOnly,ng_server,ws_server){
    generator.config.set('clientOnly', clientOnly);
    generator.config.set('ng-server', ng_server);
    generator.config.set('ws_server', ws_server);
  }
};
