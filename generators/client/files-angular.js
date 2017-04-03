const mkdirp = require('mkdirp');
const constants = require('../generator-constants');

const MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
const ANGULAR_DIR = constants.ANGULAR_DIR;

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const files = {
  common: [
    {
      templates: [
        '_package.json',
        '_typings.json',
        '_tslint.json',
        '_angular-cli.json',
        '_karma.conf.js',
        '_protractor.conf.js',
        '_README.md',
        '_proxy.conf.json',
        '_.editorconfig',

        //e2e files go here
        'e2e/_app.e2e-spec.ts',
        'e2e/_app.po.ts',
        'e2e/_tsconfig.json'
      ]
    }
  ],
  css: [
    // this css file will be overwritten by the sass generated css if sass is enabled
    // but this will avoid errors when running app without running sass task first
    {
      condition: generator => !generator.useSass,
      path: MAIN_SRC_DIR,
      templates: []
    }
  ],

  sass:[
    {
      condition: generator => generator.useSass,
      path: MAIN_SRC_DIR,
      templates: [
        '_styles.scss',
        'assets/_app.css',
        'assets/scss/_position.scss',
        'assets/scss/_bootstrap.scss',
        'assets/scss/_loader.scss',
        'assets/scss/themes/light/_variables.scss',
        'assets/scss/themes/dark/_variables.scss',
        'assets/scss/themes/default/_variables.scss',
        'assets/scss/themes/default/_typography.scss',
        'assets/scss/icons/_font-awesome-4.7.0.scss',
        'assets/scss/icons/_simple-line-icons-2.4.1.scss'
      ]
    }
  ],

  image: [
    {
      path: MAIN_SRC_DIR,
      templates: [
        'assets/images/_add_app.svg',
        'assets/images/_jbh-logo.png',
        'assets/images/_userIcon.PNG'
      ]
    }
  ],

  angularFonts:[
    {
      path: ANGULAR_DIR,
      templates: [
       // assets > fonts > simple-line-icons
        'assets/fonts/simple-line-icons/_Simple-Line-Icons.eot',
        'assets/fonts/simple-line-icons/_Simple-Line-Icons.svg',
        'assets/fonts/simple-line-icons/_Simple-Line-Icons.ttf',
        'assets/fonts/simple-line-icons/_Simple-Line-Icons.woff',
        'assets/fonts/simple-line-icons/_Simple-Line-Icons.woff2',

        // assets > fonts > proxima-nova
        'assets/fonts/proxima-nova/_ProximaNova-Extrabold.otf',
        'assets/fonts/proxima-nova/_ProximaNova-Light.otf',
        'assets/fonts/proxima-nova/_ProximaNova-LightItalic.otf',
        'assets/fonts/proxima-nova/_ProximaNova-RegItalic.otf',
        'assets/fonts/proxima-nova/_ProximaNova-Regular.otf',
        'assets/fonts/proxima-nova/_ProximaNova-RegularItalic.otf',
        'assets/fonts/proxima-nova/_ProximaNova-SemiboldItalic.otf',

        // assets > fonts > font-awesome
        'assets/fonts/font-awesome/_FontAwesome.otf',
        'assets/fonts/font-awesome/_fontawesome-webfont.eot',
        'assets/fonts/font-awesome/_fontawesome-webfont.svg',
        'assets/fonts/font-awesome/_fontawesome-webfont.ttf',
        'assets/fonts/font-awesome/_fontawesome-webfont.woff',
        'assets/fonts/font-awesome/_fontawesome-webfont.woff2'
      ]
    }
  ],

  commonWeb: [
    {
      path: MAIN_SRC_DIR,
      templates: [
        '_favicon.ico',
        {file:'_index.html', method:'processPropsFile', options:{applicationName:{
          config: true,
          configName:'appTitle'
        }
        }}
      ]
    }
  ],

  angularApp: [
    {
      path: ANGULAR_DIR,
      templates: [
        '_main.ts',
        '_polyfills.ts',
        '_test.ts',
        '_tsconfig.json'
      ]
    }
  ],

  angularApi:[
    {
      path: ANGULAR_DIR,
      templates: [
        'api/_mock.json'
      ]
    }
  ],

  angularMain: [
    {
      path: ANGULAR_DIR,
      templates: [
        'app/_app.module.ts',
        'app/_app-routing.module.ts',
        'app/_app.component.ts',
        'app/_app.component.html',
        'app/_app.component.spec.ts'
      ]
    },
    {
      condition: generator => generator.useSass,
      path: ANGULAR_DIR,
      templates: [
        'app/_app.component.scss'
      ]
    }
  ],

  angularCore:[
    {
      path: ANGULAR_DIR,
      templates: [
        // app > core
        'app/core/_core.module.ts',

        // app > core > header
        'app/core/header/_header.module.ts',
        'app/core/header/_header.component.ts',
        { file:'app/core/header/_header.component.html', method: 'processPropsFile',options:{applicationName:
          {
            config: true,
            configName:'appTitle'
          }
        }},
        'app/core/header/_header.component.spec.ts',

        // app > core > search
        'app/core/search/_search.module.ts',
        'app/core/search/_search.component.ts',
        'app/core/search/_search.component.html',
        'app/core/search/_search.component.spec.ts',

        // app > core > sidebar-left
        'app/core/sidebar-left/_sidebar-left.module.ts',
        'app/core/sidebar-left/_sidebar-left.component.ts',
        'app/core/sidebar-left/_sidebar-left.component.html',
        'app/core/sidebar-left/_sidebar-left.component.spec.ts',

        // app > core > sidebar-right
        'app/core/sidebar-right/_sidebar-right.module.ts',
        'app/core/sidebar-right/_sidebar-right.component.ts',
        'app/core/sidebar-right/_sidebar-right.component.html',
        'app/core/sidebar-right/_sidebar-right.component.spec.ts'
      ]
    },
    {
      condition: generator => generator.useSass,
      path: ANGULAR_DIR,
      templates: [
        'app/core/header/_header.component.scss',
        'app/core/search/_search.component.scss',
        'app/core/sidebar-left/_sidebar-left.component.scss',
        'app/core/sidebar-right/_sidebar-right.component.scss'
      ]
    }
  ],

  angularFeatures:[
  {
    path: ANGULAR_DIR,
    templates: [

      // app > features > dashboard
      'app/features/dashboard/_dashboard.module.ts',
      'app/features/dashboard/_dashboard.component.ts',
      'app/features/dashboard/_dashboard.component.html',
      'app/features/dashboard/_dashboard.component.spec.ts',
      'app/features/dashboard/_dashboard-routing.module.ts',

      // app > features > settings
      'app/features/settings/_settings.module.ts',
      'app/features/settings/_settings.component.ts',
      'app/features/settings/_settings.component.html',
      'app/features/settings/_settings.component.spec.ts',
      'app/features/settings/_settings-routing.module.ts'
    ]
  },
  {
    condition: generator => generator.useSass,
    path: ANGULAR_DIR,
    templates: [
      'app/features/dashboard/_dashboard.component.scss',
      'app/features/settings/_settings.component.scss'
    ]
  }
],

  angularShared:[
    {
      path: ANGULAR_DIR,
      templates: [
        // app > shared
        'app/shared/_account.ts',
        'app/shared/_account-response.ts',
        'app/shared/_customer.ts',
        'app/shared/_location.ts',
        'app/shared/_shared.module.ts'
      ]
    },
    {
      condition: generator => generator.useSass,
      path: ANGULAR_DIR,
      templates: []
    }
  ],

  angularSharedServices:[
    {
      path: ANGULAR_DIR,
      templates: [
        // app > shared > services
        'app/shared/services/_account.service.spec.ts',
        'app/shared/services/_account.service.ts',
        'app/shared/services/_location.service.spec.ts',
        'app/shared/services/_location.service.ts',
        'app/shared/services/_services.module.ts'
      ]
    }
  ],

  angularJBHDataTable:[
    {
      path: ANGULAR_DIR,
      templates: [
        // app > shared > jbh-data-table
        'app/shared/jbh-data-table/_declarations.d.ts',
        'app/shared/jbh-data-table/_index.ts',
        'app/shared/jbh-data-table/_jbh-data-table.module.ts'
      ]
    },
    {
      // app > shared > jbh-data-table > components
      path: ANGULAR_DIR,
      templates: [
        // app > shared > jbh-data-table > components
        'app/shared/jbh-data-table/components/_index.ts',
        'app/shared/jbh-data-table/components/_jbh-data-table.component.html',
        'app/shared/jbh-data-table/components/_jbh-data-table.component.ts',
        'app/shared/jbh-data-table/components/_jbh-data-table.component.spec.ts',

        // app > shared > jbh-data-table > components > search
        'app/shared/jbh-data-table/components/search/_index.ts',
        'app/shared/jbh-data-table/components/search/_data-table-typeahead-search.component.ts',
        'app/shared/jbh-data-table/components/search/_data-table-typeahead-column.component.ts',
        'app/shared/jbh-data-table/components/search/_data-table-filter-column.component.ts',
        'app/shared/jbh-data-table/components/search/_data-table-search.component.ts',

        // app > shared > jbh-data-table > components > row-detail
        'app/shared/jbh-data-table/components/row-detail/_index.ts',
        'app/shared/jbh-data-table/components/row-detail/_row-detail.directive.spec.ts',
        'app/shared/jbh-data-table/components/row-detail/_row-detail.directive.ts',
        'app/shared/jbh-data-table/components/row-detail/_row-detail-template.directive.ts',

        // app > shared > jbh-data-table > components > header
        'app/shared/jbh-data-table/components/header/_index.ts',
        'app/shared/jbh-data-table/components/header/_header.component.ts',
        'app/shared/jbh-data-table/components/header/_header-cell.component.spec.ts',
        'app/shared/jbh-data-table/components/header/_header-cell.component.ts',

        // app > shared > jbh-data-table > components > footer
        'app/shared/jbh-data-table/components/footer/_index.ts',
        'app/shared/jbh-data-table/components/footer/_footer.component.spec.ts',
        'app/shared/jbh-data-table/components/footer/_footer.component.ts',
        'app/shared/jbh-data-table/components/footer/_pager.component.html',
        'app/shared/jbh-data-table/components/footer/_pager.component.spec.ts',
        'app/shared/jbh-data-table/components/footer/_pager.component.ts',

        // app > shared > jbh-data-table > components > columns
        'app/shared/jbh-data-table/components/columns/_index.ts',
        'app/shared/jbh-data-table/components/columns/_column-header.directive.ts',
        'app/shared/jbh-data-table/components/columns/_column.directive.spec.ts',
        'app/shared/jbh-data-table/components/columns/_column.directive.ts',
        'app/shared/jbh-data-table/components/columns/_column-cell.directive.ts',

        // app > shared > jbh-data-table > components > body
        'app/shared/jbh-data-table/components/body/_index.ts',
        'app/shared/jbh-data-table/components/body/_body.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_body.component.ts',
        'app/shared/jbh-data-table/components/body/_body-cell.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_body-cell.component.ts',
        'app/shared/jbh-data-table/components/body/_body-row.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_body-row.component.ts',
        'app/shared/jbh-data-table/components/body/_body-row-wrapper.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_body-row-wrapper.component.ts',
        'app/shared/jbh-data-table/components/body/_progress-bar.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_progress-bar.component.ts',
        'app/shared/jbh-data-table/components/body/_scroller.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_scroller.component.ts',
        'app/shared/jbh-data-table/components/body/_selection.component.spec.ts',
        'app/shared/jbh-data-table/components/body/_selection.component.ts'
      ]
    },
    {
      // app > shared > jbh-data-table > directives
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-data-table/directives/_index.ts',
        'app/shared/jbh-data-table/directives/_draggable.directive.spec.ts',
        'app/shared/jbh-data-table/directives/_draggable.directive.ts',
        'app/shared/jbh-data-table/directives/_long-press.directive.spec.ts',
        'app/shared/jbh-data-table/directives/_long-press.directive.ts',
        'app/shared/jbh-data-table/directives/_orderable.directive.spec.ts',
        'app/shared/jbh-data-table/directives/_orderable.directive.ts',
        'app/shared/jbh-data-table/directives/_resizeable.directive.spec.ts',
        'app/shared/jbh-data-table/directives/_resizeable.directive.ts',
        'app/shared/jbh-data-table/directives/_visibility.directive.spec.ts',
        'app/shared/jbh-data-table/directives/_visibility.directive.ts'
      ]
    },

    {
      // app > shared > jbh-data-table > fonts
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-data-table/fonts/_data-table.eot',
        'app/shared/jbh-data-table/fonts/_data-table.svg',
        'app/shared/jbh-data-table/fonts/_data-table.ttf',
        'app/shared/jbh-data-table/fonts/_data-table.woff'
      ]
    },
    {
      // app > shared > jbh-data-table > types
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-data-table/types/_index.ts',
        'app/shared/jbh-data-table/types/_click.type.ts',
        'app/shared/jbh-data-table/types/_column-mode.type.ts',
        'app/shared/jbh-data-table/types/_selection.type.ts',
        'app/shared/jbh-data-table/types/_sort.type.ts',
        'app/shared/jbh-data-table/types/_sort-direction.type.ts',
        'app/shared/jbh-data-table/types/_table-column.type.ts'
      ]
    },
    {
      // app > shared > jbh-data-table > utils
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-data-table/utils/_index.ts',
        'app/shared/jbh-data-table/utils/_id.ts',
        'app/shared/jbh-data-table/utils/_camel-case.ts',
        'app/shared/jbh-data-table/utils/_visibility-observer.ts',
        'app/shared/jbh-data-table/utils/_column.ts',
        'app/shared/jbh-data-table/utils/_column-helper.ts',
        'app/shared/jbh-data-table/utils/_deep-getter.ts',
        'app/shared/jbh-data-table/utils/_keys.ts',
        'app/shared/jbh-data-table/utils/_math.spec.ts',
        'app/shared/jbh-data-table/utils/_math.ts',
        'app/shared/jbh-data-table/utils/_prefixes.ts',
        'app/shared/jbh-data-table/utils/_row-height-cache.ts',
        'app/shared/jbh-data-table/utils/_scrollbar-width.ts',
        'app/shared/jbh-data-table/utils/_selection.ts',
        'app/shared/jbh-data-table/utils/_sort.ts',
        'app/shared/jbh-data-table/utils/_throttle.ts',
        'app/shared/jbh-data-table/utils/_translate.ts'
      ]
    },
    {
      condition: generator => generator.useSass,
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-data-table/components/_jbh-data-table.component.scss',
        'app/shared/jbh-data-table/themes/_icons.scss',
        'app/shared/jbh-data-table/themes/_material.scss'
      ]
    }
  ],

  angularJBHTypeAhead:[
    // app > shared > jbh-typeahead
    {
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-typeahead/_jbh-typeahead.module.ts',
        'app/shared/jbh-typeahead/_jbh-typeahead.component.ts',
        'app/shared/jbh-typeahead/_jbh-typeahead.component.html',
        'app/shared/jbh-typeahead/_jbh-typeahead.component.spec.ts'
      ]
    },
    {
      condition: generator => generator.useSass,
      path: ANGULAR_DIR,
      templates: [
        'app/shared/jbh-typeahead/_jbh-typeahead.component.scss'
      ]
    }
  ],

  angularEnvironment: [
    {
      path: ANGULAR_DIR,
      templates: [
        'environments/_environment.prod.ts',
        'environments/_environment.ts'
      ]
    }
  ],
};

module.exports = {
  writeFiles,
  files
};

function writeFiles(generator) {

  mkdirp(MAIN_SRC_DIR);
  // write angular 2.x and above files
  this.writeFilesToDisk(files, this, false,'');
}
