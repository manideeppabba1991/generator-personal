const path = require('path');
const crypto = require('crypto');

module.exports = {
    askForServerSideOpts,
    askForPackageName
};

function askForPackageName(){
    if(this.existingProject) return;
    const done = this.async();
    const defaultPackageName = "JBApp";
    this.prompt({
        type: 'input',
        name: 'packageName',
        validate: (input) => {
            if (!(/^([a-zA-Z]*)$/.test(input))) {
                return 'Your application name cannot contain number, special characters or a blank space';
            } else if(input.toLowerCase() === 'jbhunt'){
                return 'Your application name cannot be named \'jbhunt\'.'
            } else if (input === 'application') {
                return 'Your application name cannot be named \'application\' as this is a reserved name for Spring Boot';
            }
            return true;
        },
        message: response => this.getNumberedQuestion('What is the package name of your application ("com.jbhunt.______ ?")?', true),
        default: defaultPackageName
    }).then((prompt) => {
        this.packageName = 'com.jbhunt.'+prompt.packageName;
        this.mainPackageName = prompt.packageName[0].toUpperCase()+prompt.packageName.slice(1);
        done();
    });
}

function askForServerSideOpts() {
    if (this.existingProject) return;

    const done = this.async();
    const defaultPackaging = 'war';
    const defaultArtifactId = 'app_myDomain_JBAPP';

    const prompts = [
        {
            type: 'input',
            name: 'artifactId',
            validate: (input) => {
                const validCheck = ['app','batch','kapow','lib','listener','ws'];
                var isValid = validCheck.indexOf(input.split('_')[0]) > -1;
                if (!(/^([a-zA-Z_]*)$/.test(input))) {
                    return 'Your application name cannot contain number, special characters or a blank space';
                } else if(input.toLowerCase() === 'jbhunt'){
                    return 'Your artifact Id cannot be named \'jbhunt\'.'
                } else if (input === 'application') {
                    return 'Your artifact Id cannot be named \'application\' as this is a reserved name for Spring Boot';
                } else if(!isValid){
                    return 'Your artifact Id must start with repository type (ex: "app_", "ws_")';
                } else if(input.split('_').length < 3){
                    return 'Your artifact Id does not follow the naming convention. Please try again with the correct naming convention.'
                }
                return true;
            },
            message: response => this.getNumberedQuestion('What is the Artifact Id / Repository Name (ex: projectType_repoDomain_projectName)?', true),
            default: defaultArtifactId
        },
        {
            type: 'list',
            name: 'packaging',
            message: response => this.getNumberedQuestion('Choose one packaging style: ', true),
            choices: [
                {
                    value: defaultPackaging,
                    name: 'war'
                },
                {
                    value: 'jar',
                    name: 'jar'
                },
            ],
            default: defaultPackaging
        }
    ];

    this.prompt(prompts).then((props) => {
        this.packaging = props.packaging;
        this.artifactId = props.artifactId;
        done();
    });
}
