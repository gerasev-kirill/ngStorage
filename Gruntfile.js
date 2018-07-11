(function() {
  'use strict';

  module.exports = function(grunt) {
    var browsers, jsBottomWrapper, jsTopWrapper;
    browsers = ['Chrome', 'PhantomJS', 'Firefox'];
    if (process.env.TRAVIS) {
      browsers = ['PhantomJS'];
    }
    jsTopWrapper = "(function(root, factory) {\n  'use strict';\n  if (typeof define === 'function' && define.amd) {\n    define(['angular'], factory);\n  } else if (typeof exports === 'object') {\n    module.exports = factory(require('angular'));\n  } else {\n    factory(root.angular);\n  }\n})(this, function(angular) {\n//-----------------------------------------\n";
    jsBottomWrapper = "\n//-----------------------------------------\n});";
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      coffee: {
        test: {
          options: {
            bare: true,
            sourceMap: true
          },
          files: {
            'test/spec.js': 'test/spec.coffee'
          }
        },
        src: {
          expand: true,
          cwd: 'src',
          src: ['**/*.coffee'],
          dest: 'src',
          ext: '.js'
        }
      },
      concat: {
        dist: {
          src: ['src/module.js', 'src/directive.js'],
          dest: 'dist/ngStorage.js'
        }
      },
      karma: {
        storages: {
          options: {
            files: ['components/angular/angular.js', 'components/angular-mocks/angular-mocks.js', 'components/chai/chai.js', 'dist/ngStorage.js', 'test/spec.js']
          },
          preprocessors: {
            'dist/*.js': ['sourcemap']
          },
          frameworks: ['mocha'],
          browsers: browsers,
          singleRun: true
        },
        gdpr: {
          options: {
            files: ['components/angular/angular.js', 'components/angular-mocks/angular-mocks.js', 'components/chai/chai.js', 'dist/ngStorage.js', 'test/gdprSpec.js']
          },
          preprocessors: {
            'dist/*.js': ['sourcemap']
          },
          frameworks: ['mocha'],
          browsers: browsers,
          singleRun: true
        }
      },
      ngAnnotate: {
        files: {
          cwd: 'dist',
          expand: true,
          src: ['./ngStorage.js'],
          dest: 'dist'
        }
      },
      file_append: {
        ngstorage: {
          files: [
            {
              prepend: jsTopWrapper,
              append: jsBottomWrapper,
              input: 'dist/ngStorage.js',
              output: 'dist/ngStorage.js'
            }
          ]
        }
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright (c) <%= grunt.template.today("yyyy") %> Gias Kay Lee | MIT License */\n'
        },
        build: {
          src: 'dist/ngStorage.js',
          dest: 'dist/ngStorage.min.js'
        }
      },
      wiredep: {
        index: {
          src: ['./doc/*'],
          options: {
            cwd: './',
            ignorePath: '..',
            dependencies: true,
            devDependencies: false,
            bowerJson: grunt.file.readJSON('./bower.json')
          }
        }
      },
      'http-server': {
        dev: {
          root: './',
          port: 8000,
          host: 'localhost',
          ext: 'html',
          runInBackground: false
        }
      },
      watch: {
        dev: {
          files: ['src/*.js', 'doc/*.js', 'doc/*.pug'],
          tasks: ['wiredep', 'replace']
        }
      },
      replace: {
        options: {},
        files: {
          expand: true,
          cwd: 'src',
          src: ['**/*.js', '**/*.html'],
          dest: 'src'
        }
      },
      angular_template_inline_js: {
        options: {
          basePath: __dirname
        },
        files: {
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'src'
        }
      },
      nggettext_extract: {
        pot: {
          files: {
            'po/template.pot': ['src/**/*html', 'src/**/*.js']
          }
        }
      }
    });
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-simple-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-template-inline-js');
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.registerTask('test', ['coffee', 'replace', 'angular_template_inline_js', 'ngAnnotate', 'concat', 'file_append', 'karma']);
    grunt.registerTask('build', ['coffee', 'nggettext_extract', 'replace', 'angular_template_inline_js', 'ngAnnotate', 'concat', 'file_append', 'uglify']);
    grunt.registerTask('default', ['coffee', 'test', 'ngAnnotate', 'uglify']);
  };

}).call(this);
