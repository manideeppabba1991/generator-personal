module.exports = {
  askForModuleName,
  askForApplicationTitle
};

function askForModuleName() {
  if (this.baseName) return;
  this.askModuleName(this);
}

function askForApplicationTitle(){
  const done = this.async();
  const defaultAppTitle = "J.B. Hunt Application";
  this.prompt({
    type: 'input',
    name: 'appTitle',
    message: response => this.getNumberedQuestion('What is the title of your application?', true),
    default: defaultAppTitle
  }).then((prompt) => {
    this.appTitle = prompt.appTitle;
    done();
  });
}
