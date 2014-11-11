'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    // We can use bower.json to store this, for example.
    // require('./bower.json').appPath
    var appConfig = {
        src: 'src',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        root: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: [
                    '<%= root.src %>/app/{,*/}*.js',
                    '<%= root.src %>/common/{,*/}*.js'
                ],
                tasks: ['newer:jshint:all', 'newer:jsdoc'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            compass: {
                files: ['<%= root.src %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= root.src %>/{,*/}*.html',
                    '<%= root.src %>/{,*/}*.css',
                    '.tmp/styles/{,*/}*.css',
                    '<%= root.src %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 8033,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.src)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.src)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= root.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= root.src %>/app/{,*/}*.js',
                    '<%= root.src %>/common/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= root.dist %>/{,*/}*',
                        '!<%= root.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= root.src %>/index.html'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= root.src %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= root.src %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/img/generated',
                imagesDir: '<%= root.src %>/assets/img',
                javascriptsDir: [
                    '<%= root.src %>/app/',
                    '<%= root.src %>/common/'
                ],
                fontsDir: '<%= root.src %>/styles/fonts',
                importPath: './bower_components',
                httpImagesPath: '/img',
                httpGeneratedImagesPath: '/img/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= root.dist %>/img/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= root.dist %>/src/**/*.js',
                    '<%= root.dist %>/styles/{,*/}*.css',
                    '<%= root.dist %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= root.src %>/index.html',
            options: {
                dest: '<%= root.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= root.dist %>/**/*.html'],
            css: ['<%= root.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: [
                    '<%= root.dist %>',
                    '<%= root.dist %>/assets/img'
                ]
            }
        },

        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //     dist: {
        //         files: {
        //             '<%= root.dist %>/styles/main.css': [
        //                 '.tmp/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        // },
        // uglify: {
        //     dist: {
        //         files: {
        //             '<%= root.dist %>/scripts/scripts.js': [
        //                 '<%= root.dist %>/scripts/scripts.js'
        //             ]
        //         }
        //     }
        // },
        // concat: {
        //     dist: {}
        // },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= root.src %>/assets/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= root.dist %>/img'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= root.src %>/assets/img',
                    src: '{,*/}*.svg',
                    dest: '<%= root.dist %>/img'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeComments: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= root.dist %>',
                    src: [
                        '*.html',
                        'app/{,*/}*.html'
                    ],
                    dest: '<%= root.dist %>'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: ['*.js', '!oldieshim.js'],
                    dest: '.tmp/concat/js'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: [ /*'<%= root.dist %>/*.html'*/ ]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= root.src %>',
                    dest: '<%= root.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'config.js',
                        'app/{,*/}*.html',
                        'assets/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        'styles/fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= root.dist %>/img',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: 'fonts/*',
                    dest: '<%= root.dist %>'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= root.src %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                // 'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        githooks: {
            options: {
                dest: '../.git/hooks'
            },
            all: {
                // Will run the jshint and test:unit tasks at every commit
                'pre-commit': 'test',
            }
        },

        jsdoc: {
            dist: {
                src: ['./src/**/*.js', './README.md'],
                dest: 'doc'
            }
        },

        'string-replace': {
            dist: {
                files: {
                    '<%= root.dist %>/styles/': '<%= root.dist %>/styles/main.*.css'
                },
                options: {
                    replacements: [{
                        pattern: /\/assets/ig,
                        replacement: '../assets'
                    }]
                }
            },
        },

        'sftp-deploy': {
            build: {
                auth: {
                    host: 'phchbs-sd220055',
                    port: 22,
                    authKey: 'apache'
                },
                cache: 'sftpCache.json',
                src: '<%= root.dist %>',
                dest: '/var/www/html/portal2',
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-sftp-deploy');

    grunt.registerTask('serve', 'Compile then start a connect web server',
        function(target) {
            if (target === 'dist') {
                return grunt.task.run(['build', 'connect:dist:keepalive']);
            }

            grunt.task.run([
                'clean:server',
                'wiredep',
                'concurrent:server',
                'autoprefixer',
                'connect:livereload',
                'watch'
            ]);
        });

    grunt.registerTask('server',
        'DEPRECATED TASK. Use the "serve" task instead', function(target) {
            grunt.log.warn(
                'The `server` task has been deprecated. Use `grunt serve` to start a server.'
            );
            grunt.task.run(['serve:' + target]);
        });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'string-replace',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};