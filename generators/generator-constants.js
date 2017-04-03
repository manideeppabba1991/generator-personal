
const NODE_VERSION = '6.10.0';
const NPM_VERSION = '4.3.0';

const MAIN_DIR = 'src/main/';
const TEST_DIR = 'src/test/';
const PACKAGE_DIR = 'com.jbhunt.JBAPP';

// Note: this will be prepended with 'target/' for Maven, or with 'build/' for Gradle.
const CLIENT_DIST_DIR = 'www/';

const SUPPORTED_VALIDATION_RULES = ['required', 'max', 'min', 'maxlength', 'minlength', 'maxbytes', 'minbytes', 'pattern'];

// documentation constants
const JBH_UI_GENERATOR_DOCUMENTATION_URL = 'https://ui.jbhunt.com/creating-an-app/';
//const JBH_UI_GENERATOR_DOCUMENTATION_ARCHIVE_PATH = '/documentation-archive/'; do we have this ?

const constants = {
  QUESTIONS: 15, // maximum possible number of questions
  APP_QUESTIONS:2,
  CLIENT_QUESTIONS: 1,
  SERVER_QUESTIONS: 3,
  INTERPOLATE_REGEX: /<%:([\s\S]+?)%>/g, // so that tags in templates do not get mistreated as _ templates
  //DOCKER_DIR: `${MAIN_DIR}docker/`,

  MAIN_DIR,
  TEST_DIR,
  PACKAGE_DIR,

  CLIENT_MAIN_SRC_DIR: `${MAIN_DIR}ui/`,
  CLIENT_DIST_DIR,
  ANGULAR_DIR: `${MAIN_DIR}ui/`,

  SERVER_MAIN_SRC_DIR: `${MAIN_DIR}java/`,
  SERVER_MAIN_RES_DIR: `${MAIN_DIR}resources/`,
  SERVER_TEST_SRC_DIR: `${TEST_DIR}java/`,

  // entity related
  SUPPORTED_VALIDATION_RULES,

  JBH_UI_GENERATOR_DOCUMENTATION_URL,
  //JBH_UI_GENERATOR_DOCUMENTATION_ARCHIVE_PATH,

  NODE_VERSION,
  NPM_VERSION,
};

module.exports = constants;
