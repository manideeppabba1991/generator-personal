const html = require('html-wiring');
const ejs = require('ejs');

module.exports = {
  renderContent,
  copyWebResource
};

function renderContent(source, generator, context, options, cb) {
    ejs.renderFile(generator.templatePath(source), context, options, (err, res) => {
      if (!err) {
        cb(res);
      }else {
        generator.error(`Copying template ${source} failed. [${err}]`);
      }
    });
}

function copyWebResource(source, dest, regex, type, generator, opt = {}, template) {
  if (generator.enableTranslation) {
    generator.template(source, dest, generator, opt);
  } else {
    renderContent(source, generator, generator, opt, (body) => {
      body = body.replace(regex, '');
      switch (type) {
        case 'html' :
          body = replacePlaceholders(body, generator);
          break;
        case 'js' :
          body = replaceTitle(body, generator);
          break;
        default:
          break;
      }
      generator.fs.write(dest, body);
    });
  }
}
