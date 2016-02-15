module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            TypeScript: {
                command: 'node node_modules/typescript/bin/tsc --sourceMap --out js/app.js source/app.ts'
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    "css/style.css": "source/less/style.less"
                }
            }
        },
        watch: {
            scripts: {
                files: ['source/**/*.ts', 'source/less/*.less'],
                tasks: ['less', 'shell']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['less', 'shell', 'watch']);

};