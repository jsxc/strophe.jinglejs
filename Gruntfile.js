/* global module:false */

module.exports = function(grunt) {

    grunt.initConfig({
        app: grunt.file.readJSON('package.json'),
        meta: {
           banner: grunt.file.read('banner.js')
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            files: ['strophe.jinglejs.js']
        },
        jsbeautifier: {
            module: {
                src: ['strophe.jinglejs.js'],
                options: {
                    js: {
                        indentSize: 3,
                        endWithNewline: true
                    }
                }
            }
        },
        browserify: {
            module:{src: ['strophe.jinglejs.js'],
            dest: 'strophe.jinglejs-bundle.js'}
        },
        usebanner: {
          dist: {
             options: {
                position: 'top',
                banner: '<%= meta.banner %>'
             },
             files: {
                src: ['strophe.jinglejs-bundle.js']
             }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'browserify', 'usebanner']);
};
