'use strict';
module.exports = {
    askForApplicationFramework,
    askForModuleName
};

function askForApplicationFramework() {
    if (this.existingProject) return;

    const DEFAULT_APPTYPE = 'server+client';
    const done = this.async();

    this.prompt({
        type: 'list',
        name: 'applicationFramework',
        message: response => this.getNumberedQuestion('Which *type* of application would you like to create?', true),
        choices: [
            {
                value: DEFAULT_APPTYPE,
                name: 'App_ng_Springboot'
            },
            {
                value: 'client',
                name: 'App_ng (UI only)'
            },
            {
                value: 'server+webservice',
                name: 'WS_Springboot'
            }
        ],
        default: DEFAULT_APPTYPE
    }).then((prompt) => {
        this.applicationFramework = this.configOptions.applicationFramework = prompt.applicationFramework;
        done();
    });
}

function askForModuleName() {
    if (this.existingProject) return;

    this.askModuleName(this);
    this.configOptions.lastQuestion = this.currentQuestion;
    this.configOptions.totalQuestions = this.totalQuestions;
}
