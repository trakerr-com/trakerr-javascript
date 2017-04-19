module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ng-annotate');
    
    // Default task.
    //grunt.registerTask('default', ['jshint','build','karma:unit']);
    // grunt.registerTask('build', ['clean:output', 'copy:all']);
    grunt.registerTask('build', ['clean:output', 'copy:nonSources', 'uglify:sources']);
    grunt.registerTask('release', ['clean:output', 'copy:nonSources', 'uglify:sources']);
    grunt.registerTask('watchClient', ['build', 'watch']);
    grunt.registerTask('runNode', [ 'nodemon']);
    //grunt.registerTask('test-watch', ['karma:watch']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    var karmaConfig = function(configFile, customOptions) {
        var options = { configFile: configFile, keepalive: true };
        var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
        return grunt.util._.extend(options, customOptions, travisOptions);
    };

    grunt.initConfig({
        dirs: {
            output: '../dist'
        },
        pkg: grunt.file.readJSON('package.json'),
        banner:
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        copy: {
            all: {
                expand: true,
                cwd: 'trakerr-javascript/',
                src: ['trakerr-javascript/generated/src/trakerr/**/*.js', 'trakerr-javascript/index.js'],
                dest: '<%= dirs.output %>/'
            },
            nonSources: {
                expand: true,
                cwd: 'trakerr-javascript/',
                src: ['trakerr-javascript/**/*.md'],
                dest: '<%= dirs.output %>/'
            }
        },
        clean: {
            options: {
                'force': true
            },
            output: [
                '<%= dirs.output %>/*'
            ]
        },
        karma: {
            unit: { options: karmaConfig('test/config/unit.js') },
            watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
        },
        concurrent: {
            dev: {
                tasks: ['watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        ngAnnotate: {
            sources: {
                files: {
                    'src/app/app.js': ['src/app/app.js'],
                    'src/app/userService.js': ['src/app/userService.js'],
                    "src/app/common/auth/loginSetup.js" : ["src/app/common/auth/loginSetup.js"],
                    "src/app/components/applications/applicationService.js" : ["src/app/components/applications/applicationService.js"],
                    "src/app/common/header/headerCtrl.js" : ["src/app/common/header/headerCtrl.js"],
                    "src/app/components/home/homeCtrl.js" : ["src/app/components/home/homeCtrl.js"],
                    "src/app/components/signup/signupCtrl.js" : ["src/app/components/signup/signupCtrl.js"],
                    "src/app/components/pricing/pricingCtrl.js" : ["src/app/components/pricing/pricingCtrl.js"],
                    "src/app/components/applications/integrations/alertsCtrl.js" : ["src/app/components/applications/integrations/alertsCtrl.js"],
                    "src/app/docs/api/languagesCtrl.js" : ["src/app/docs/api/languagesCtrl.js"],
                    "src/app/components/applications/applicationCtrl.js" : ["src/app/components/applications/applicationCtrl.js"],
                    "src/app/components/applications/details/applicationDashboardCtrl.js" : ["src/app/components/applications/details/applicationDashboardCtrl.js"],
                    "src/app/components/applications/details/applicationDetailsService.js" : ["src/app/components/applications/details/applicationDetailsService.js"],
                    "src/app/components/applications/details/applicationDetailCtrl.js" : ["src/app/components/applications/details/applicationDetailCtrl.js"],
                    "src/app/components/applications/details/applicationDetailsListViewCtrl.js" : ["src/app/components/applications/details/applicationDetailsListViewCtrl.js"],
                    "src/app/components/applications/details/applicationDetailsListElementCtrl.js" : ["src/app/components/applications/details/applicationDetailsListElementCtrl.js"],
                    "src/app/components/applications/details/searchService.js" : ["src/app/components/applications/details/searchService.js"],
                    "src/app/components/applications/details/segmentsService.js" : ["src/app/components/applications/details/segmentsService.js"],
                    "src/app/components/applications/details/chartService.js" : ["src/app/components/applications/details/chartService.js"],
                    "src/app/components/applications/details/tabs/overviewCtrl.js" : ["src/app/components/applications/details/tabs/overviewCtrl.js"],
                    "src/app/components/applications/details/tabs/detailTabsCtrl.js" : ["src/app/components/applications/details/tabs/detailTabsCtrl.js"],
                    "src/app/components/applications/details/tabs/messagesTabsCtrl.js" : ["src/app/components/applications/details/tabs/messagesTabsCtrl.js"],
                    "src/app/components/applications/integrations/applicationIntegrationsCtrl.js" : ["src/app/components/applications/integrations/applicationIntegrationsCtrl.js"],
                    "src/app/components/applications/permissions/applicationPermissionsCtrl.js" : ["src/app/components/applications/permissions/applicationPermissionsCtrl.js"]
                }
            }

        },
        uglify: {
            options: {
                // sourceMap: true
                //, sourceMapName: 'src/app-uglified.js.map'
            },
            sources: {
                src: ['generated/src/trakerr/**/*.js', 'index.js'],
                dest: 'dist/app-uglified.js',
                sourceMap: true
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '../server/src/public/assets/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '../server/src/public/assets/css'
                }]
            }
        },
        htmlmin: {
            options: {                                 // Target options
                collapseWhitespace: true,
                removeComments: false,
                collapseBooleanAttributes: false,
                removeAttributeQuotes: false,
                removeEmptyAttributes: false,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false
            },
            target: {                                       // Another target
                files: [{
                    expand: true,
                    cwd: '../server/src/public',
                    src: ['app/**/*.html', '*.html'],
                    dest: '../server/src/public'
                }]
            }
        },
        watch: {
            all: {
                files: [
                    'src/**'
                ],
                tasks: ['build' ],
                options: {
                    spawn: false
                }
            }
        },
        nodemon: {
            dev: {
                cwd: '../server',
                script: 'src/server.js',
                options: {
                    nodeArgs: ['--debug=3001'],
                    cwd: '../server',
                    /*Environment variables required by the NODE application */
                    env: {
                        "NODE_ENV": "development"
                        , "NODE_CONFIG": "dev"
                    },
                    ignore: ["src/public"],
                    /*watch: ["*.js", "./*.html"],*/
                    delay: 300,

                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        /** Open the application in a new browser window and is optional **/
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:3000', 'Google Chrome');
                            }, 1000);
                        });

                        /** Update .rebooted to fire Live-Reload **/
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                //require('open')('http://127.0.0.1:3000', 'Google Chrome');
                                require('fs').writeFileSync('../.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        }
    });

};