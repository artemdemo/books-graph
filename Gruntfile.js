module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'node_modules/d3/d3.min.js',
                    'vendor/promise.js',
                    'dist/app.js'
                ],
                dest: 'dist/bundle.js'
            }
        },
        shell: {
            TypeScript: {
                command: 'node node_modules/typescript/bin/tsc --sourceMap --out dist/app.js source/app.ts'
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    "dist/css/style.css": "source/less/style.less"
                }
            }
        },
        watch: {
            scripts: {
                files: ['source/**/*.ts', 'source/less/*.less'],
                tasks: ['less', 'shell', 'concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['less', 'shell', 'concat', 'watch']);

};