/* global module:false */

module.exports = function(grunt) {

    grunt.initConfig({
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'browserify']);
};
