const mkdirp = require('mkdirp');
//const cleanup = require('../cleanup');
const constants = require('../generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const TEST_DIR = constants.TEST_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;

module.exports = {
    writeFiles
};

let javaDir;
let testDir;
let destJavaDir;
let destTestDir;
let mainPackageName;

function writeFiles() {
    return {

        setUpJavaDir() {
            javaDir = this.javaDir = `${constants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
            destJavaDir = this.destJavaDir = `${constants.SERVER_MAIN_SRC_DIR + this.packageName}/`;
            mainPackageName = this.mainPackageName;
        },

        setUpTestDir() {
            testDir = this.testDir = `${constants.SERVER_TEST_SRC_DIR + this.packageFolder}/`;
            destTestDir = this.destTestDir = `${constants.SERVER_TEST_SRC_DIR + this.packageName}/`;
        },

        writeServerBuildFiles() {
            switch (this.buildTool) {
                /*case 'gradle':
                    this.template('_build.gradle', 'build.gradle');
                    this.template('_settings.gradle', 'settings.gradle');
                    this.template('_gradle.properties', 'gradle.properties');
                    if (!this.skipClient && this.clientFramework === 'angular1') {
                        this.template('gradle/_yeoman.gradle', 'gradle/yeoman.gradle');
                    }
                    this.template('gradle/_sonar.gradle', 'gradle/sonar.gradle');
                    this.template('gradle/_docker.gradle', 'gradle/docker.gradle');
                    this.template('gradle/_profile_dev.gradle', 'gradle/profile_dev.gradle', this, {interpolate: INTERPOLATE_REGEX});
                    this.template('gradle/_profile_prod.gradle', 'gradle/profile_prod.gradle', this, {interpolate: INTERPOLATE_REGEX});
                    this.template('gradle/_mapstruct.gradle', 'gradle/mapstruct.gradle', this, {interpolate: INTERPOLATE_REGEX});
                    this.template('gradle/_graphite.gradle', 'gradle/graphite.gradle');
                    this.template('gradle/_prometheus.gradle', 'gradle/prometheus.gradle');
                    if (this.gatlingTests) {
                        this.template('gradle/_gatling.gradle', 'gradle/gatling.gradle');
                    }
                    if (this.databaseType === 'sql') {
                        this.template('gradle/_liquibase.gradle', 'gradle/liquibase.gradle');
                    }
                    this.copy('gradlew', 'gradlew');
                    this.copy('gradlew.bat', 'gradlew.bat');
                    this.copy('gradle/wrapper/gradle-wrapper.jar', 'gradle/wrapper/gradle-wrapper.jar');
                    this.copy('gradle/wrapper/gradle-wrapper.properties', 'gradle/wrapper/gradle-wrapper.properties');
                    break;*/
                case 'maven':
                default :
                    this.copy('mvnw', 'mvnw');
                    this.copy('mvnw.cmd', 'mvnw.cmd');
                    //this.copy('.mvn/wrapper/maven-wrapper.jar', '.mvn/wrapper/maven-wrapper.jar');
                    //this.copy('.mvn/wrapper/maven-wrapper.properties', '.mvn/wrapper/maven-wrapper.properties');
                    this.template('pom.xml', 'pom.xml', null, {interpolate: INTERPOLATE_REGEX});
            }
        },

        writeServerResourceFiles() {
            // Create Java resource files
            mkdirp(SERVER_MAIN_RES_DIR);
            this.copy(`${SERVER_MAIN_RES_DIR}templates/_README.MD`, `${SERVER_MAIN_RES_DIR}templates/README.MD`);
            this.template(`${SERVER_MAIN_RES_DIR}_application.yml`, `${SERVER_MAIN_RES_DIR}application.yml`);

            //TODO: implement if required
           /* if (this.devDatabaseType === 'h2Disk' || this.devDatabaseType === 'h2Memory') {
                this.template(`${SERVER_MAIN_RES_DIR}h2.server.properties`, `${SERVER_MAIN_RES_DIR}.h2.server.properties`);
            }

            // Thymeleaf templates
            this.copy(`${SERVER_MAIN_RES_DIR}templates/error.html`, `${SERVER_MAIN_RES_DIR}templates/error.html`);

            this.template(`${SERVER_MAIN_RES_DIR}_logback-spring.xml`, `${SERVER_MAIN_RES_DIR}logback-spring.xml`, this, {interpolate: INTERPOLATE_REGEX});


            this.template(`${SERVER_MAIN_RES_DIR}config/_application-dev.yml`, `${SERVER_MAIN_RES_DIR}config/application-dev.yml`);
            this.template(`${SERVER_MAIN_RES_DIR}config/_application-prod.yml`, `${SERVER_MAIN_RES_DIR}config/application-prod.yml`);
            if (this.databaseType === 'sql') {
                this.template(`${SERVER_MAIN_RES_DIR}/config/liquibase/changelog/_initial_schema.xml`, `${SERVER_MAIN_RES_DIR}config/liquibase/changelog/00000000000000_initial_schema.xml`, this, {interpolate: INTERPOLATE_REGEX});
                this.copy(`${SERVER_MAIN_RES_DIR}/config/liquibase/master.xml`, `${SERVER_MAIN_RES_DIR}config/liquibase/master.xml`);
            }

            if (this.databaseType === 'mongodb') {
                this.template(`${SERVER_MAIN_SRC_DIR}package/config/dbmigrations/_package-info.java`, `${javaDir}config/dbmigrations/package-info.java`);
                if (!this.skipUserManagement) {
                    this.template(`${SERVER_MAIN_SRC_DIR}package/config/dbmigrations/_InitialSetupMigration.java`, `${javaDir}config/dbmigrations/InitialSetupMigration.java`);
                }
            }

            if (this.databaseType === 'cassandra' || this.applicationType === 'gateway') {
                this.template(`${SERVER_MAIN_RES_DIR}config/cql/_create-keyspace-prod.cql`, `${SERVER_MAIN_RES_DIR}config/cql/create-keyspace-prod.cql`);
                this.template(`${SERVER_MAIN_RES_DIR}config/cql/_create-keyspace.cql`, `${SERVER_MAIN_RES_DIR}config/cql/create-keyspace.cql`);
                this.template(`${SERVER_MAIN_RES_DIR}config/cql/_drop-keyspace.cql`, `${SERVER_MAIN_RES_DIR}config/cql/drop-keyspace.cql`);
                this.copy(`${SERVER_MAIN_RES_DIR}config/cql/changelog/README.md`, `${SERVER_MAIN_RES_DIR}config/cql/changelog/README.md`);

                /!* Skip the code below for --skip-user-management *!/
                if (this.skipUserManagement) return;
                if (this.applicationType !== 'microservice' && this.databaseType === 'cassandra') {
                    this.template(`${SERVER_MAIN_RES_DIR}config/cql/changelog/_create-tables.cql`, `${SERVER_MAIN_RES_DIR}config/cql/changelog/00000000000000_create-tables.cql`);
                    this.template(`${SERVER_MAIN_RES_DIR}config/cql/changelog/_insert_default_users.cql`, `${SERVER_MAIN_RES_DIR}config/cql/changelog/00000000000001_insert_default_users.cql`);
                }
            }

            if (this.applicationType === 'uaa') {
                this.generateKeyStore();
            }*/
        },

        writeServerMainJavaFiles(){
            mkdirp(this.destTestDir);
            this.processPropsFile(`${javaDir}_AppJBAPPApplication.java`, `${destJavaDir}App${mainPackageName}Application.java`,this,{packageName:this.config.get('PACKAGE_DIR'), mainPackageName:this.mainPackageName});
            this.processPropsFile(`${javaDir}_ServletInitializer.java`, `${destJavaDir}ServletInitializer.java`,this,{packageName:this.config.get('PACKAGE_DIR'), mainPackageName:this.mainPackageName});
            this.processPropsFile(`${javaDir}controller/_AppController.java`, `${destJavaDir}controller/AppController.java`,this,{packageName:this.config.get('PACKAGE_DIR')});
        },

        writeServerTestJavaFiles(){
            mkdirp(this.destTestDir);
            this.processPropsFile(`${testDir}controller/_AppControllerTest.java`, `${destTestDir}controller/AppControllerTest.java`,this,{packageName:this.config.get('PACKAGE_DIR')});
            this.processPropsFile(`${testDir}_AppJBAPPApplicationTests.java`, `${destTestDir}App${mainPackageName}ApplicationTests.java`,this,{packageName:this.config.get('PACKAGE_DIR'), mainPackageName:this.mainPackageName});
        }
    };
}
