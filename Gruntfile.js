(function() {
  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      coffee: {
        Grunt: {
          files: {
            'Gruntfile.js': 'coffee/Gruntfile/**/*.coffee'
          }
        },
        server: {
          expand: true,
          cwd: 'coffee/server',
          src: "**/*.coffee",
          dest: "αSΨS/server",
          ext: ".js",
          options: {
            bare: true
          }
        },
        client: {
          expand: true,
          cwd: 'coffee/client',
          src: "**/*.coffee",
          dest: "αSΨS/client",
          ext: ".js",
          options: {
            bare: true
          }
        },
        lib: {
          expand: true,
          cwd: 'coffee/lib',
          src: "**/*.coffee",
          dest: "αSΨS/lib",
          ext: ".js",
          options: {
            bare: true
          }
        },
        recur: {
          expand: true,
          cwd: 'coffee/packages/recursive_loop',
          src: "**/*.coffee",
          dest: "αSΨS/packages/recursive_loop",
          ext: ".js",
          options: {
            bare: true
          }
        }
      },
      jshint: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          sub: true,
          nonew: false
        },
        Grunt: ['Gruntfile.js'],
        server: {
          expand: true,
          cwd: 'αSΨS/server',
          src: "**/*.js"
        },
        client: {
          expand: true,
          cwd: 'αSΨS/client',
          src: "**/*.js"
        },
        lib: {
          expand: true,
          cwd: 'αSΨS/lib',
          src: "**/*.js"
        },
        recur: {
          expand: true,
          cwd: 'αSΨS/packages/recursive_loop',
          src: "**/*.js"
        }
      },
      coffeelint: {
        options: {
          'max_line_length': {
            'level': 'ignore'
          },
          'camel_case_classes': {
            'level': 'ignore'
          }
        },
        Grunt: ['coffee/Gruntfile/**/*.coffee'],
        server: ['coffee/server/**/*.coffee'],
        client: ['coffee/client/**/*.coffee'],
        lib: ['coffee/lib/**/*.coffee'],
        recur: ['coffee/packages/recursive_loop/**/*.coffee']
      },
      concat: {
        vendor: {
          files: {
            'javascript/client/vendor.js': ['bower_components/jquery/jquery.min.js', 'bower_components/modernizr/modernizr.js', 'bower_components/foundation/js/foundation.min.js']
          }
        }
      },
      jade: {
        client: {
          expand: true,
          cwd: 'jade',
          src: "**/*.jade",
          dest: "αSΨS/client",
          ext: ".html",
          options: {
            pretty: true
          }
        }
      },
      stylus: {
        client: {
          expand: true,
          cwd: 'stylus',
          src: "**/*.stylus",
          dest: "αSΨS/client",
          ext: ".css",
          options: {
            pretty: true
          }
        }
      },
      watch: {
        server: {
          files: ['coffee/server/**/*.coffee'],
          tasks: ['default']
        },
        recur: {
          files: ['coffee/packages/recursive_loop/**/*.coffee'],
          tasks: ['build_recur']
        },
        client_j: {
          files: ['coffee/client/**/*.coffee'],
          tasks: ['build_j']
        },
        client_b: {
          files: ['coffee/lib/**/*.coffee'],
          tasks: ['build_b']
        },
        client_h: {
          files: ['jade/*.jade'],
          tasks: ['build_h']
        },
        client_c: {
          files: ['stylus/*.stylus'],
          tasks: ['build_c']
        }
      }
    });
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.registerTask('default', ['coffeelint:server', 'coffee:server', 'jshint:server']);
    grunt.registerTask('g', ['coffeelint:Grunt', 'coffee:Grunt', 'jshint:Grunt']);
    grunt.registerTask('build_j', ['coffeelint:client', 'coffee:client', 'jshint:client']);
    grunt.registerTask('build_b', ['coffeelint:lib', 'coffee:lib', 'jshint:lib']);
    grunt.registerTask('build_recur', ['coffeelint:recur', 'coffee:recur', 'jshint:recur']);
    grunt.registerTask('build_h', ['jade:client']);
    grunt.registerTask('build_c', ['stylus:client']);
    grunt.registerTask('build_r', ['jade:route']);
    return grunt.registerTask('build_v', ['concat:vendor', 'uglify:vendor', 'cssmin:vendor']);
  };

}).call(this);
