module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    coffee:
      Grunt:
        files: 'Gruntfile.js':'coffee/Gruntfile/**/*.coffee'
      server:
        expand: true,
        cwd: 'coffee/server',
        src: "**/*.coffee",
        dest: "αSΨS/server",
        ext: ".js"
        options:
          bare: true
      client:
        expand: true,
        cwd: 'coffee/client',
        src: "**/*.coffee",
        dest: "αSΨS/client",
        ext: ".js"
        options:
          bare: true
      lib:
        expand: true,
        cwd: 'coffee/lib',
        src: "**/*.coffee",
        dest: "αSΨS/lib",
        ext: ".js"
        options:
          bare: true
      rloop:
        expand: true,
        cwd: 'coffee/packages/rloop',
        src: "**/*.coffee",
        dest: "packages/rloop",
        ext: ".js"
        options:
          bare: true
      core_layout:
        expand: true,
        cwd: 'coffee/packages/core-layout',
        src: "**/*.coffee",
        dest: "packages/core-layout",
        ext: ".js"
        options:
          bare: true
      human_insert_form:
        expand: true,
        cwd: 'coffee/packages/human-insert-form',
        src: "**/*.coffee",
        dest: "packages/human-insert-form",
        ext: ".js"
        options:
          bare: true
    jshint:
      options:
        curly: true
        eqeqeq: true
        eqnull: true
        browser: true
        sub: true
        nonew: false
      Grunt: ['Gruntfile.js']
      server:
        expand: true,
        cwd: 'αSΨS/server',
        src: "**/*.js"
      client:
        expand: true,
        cwd: 'αSΨS/client',
        src: "**/*.js"
      lib:
        expand: true,
        cwd: 'αSΨS/lib',
        src: "**/*.js"
      rloop:
        expand: true,
        cwd: 'packages/rloop',
        src: "**/*.js"
      core_layout:
        expand: true,
        cwd: 'packages/core-layout',
        src: "**/*.js"
      human_insert_form:
        expand: true,
        cwd: 'packages/human-insert-form',
        src: "**/*.js"

    coffeelint:
      options:
        'max_line_length':
          'level': 'ignore'
        'camel_case_classes':
          'level': 'ignore'
      Grunt: ['coffee/Gruntfile/**/*.coffee']
      server: ['coffee/server/**/*.coffee']
      client: ['coffee/client/**/*.coffee']
      lib: ['coffee/lib/**/*.coffee']
      rloop: ['coffee/packages/rloop/**/*.coffee']
      human_insert_form: ['coffee/packages/human-insert-form/**/*.coffee']
      core_layout: ['coffee/packages/core-layout/**/*.coffee']
    concat:
      vendor:
        files: 'javascript/client/vendor.js':
          ['bower_components/jquery/jquery.min.js',
          'bower_components/modernizr/modernizr.js',
          'bower_components/foundation/js/foundation.min.js']
    jade:
      client:
        expand: true,
        cwd: 'jade/client',
        src: "**/*.jade",
        dest: "αSΨS/client",
        ext: ".html"
        options:
          pretty: true
      core_layout:
        expand: true,
        cwd: 'jade/packages/core-layout',
        src: "**/*.jade",
        dest: "packages/core-layout",
        ext: ".html"
        options:
          pretty: true
      human_insert_form:
        expand: true,
        cwd: 'jade/packages/human-insert-form',
        src: "**/*.jade",
        dest: "packages/human-insert-form",
        ext: ".html"
        options:
          pretty: true
    stylus:
      client:
        expand: true,
        cwd: 'stylus/client',
        src: "**/*.stylus",
        dest: "αSΨS/client",
        ext: ".css"
        options:
          pretty: true
      core_layout:
        expand: true,
        cwd: 'stylus/packages/core-layout',
        src: "**/*.stylus",
        dest: "packages/core-layout",
        ext: ".css"
        options:
          pretty: true
      human_insert_form:
        expand: true,
        cwd: 'stylus/packages/human-insert-form',
        src: "**/*.stylus",
        dest: "packages/human-insert-form",
        ext: ".css"
        options:
          pretty: true
    watch:
      server:
        files: ['coffee/server/**/*.coffee']
        tasks: ['default']
      rloop:
        files: ['coffee/packages/rloop/**/*.coffee']
        tasks: ['build_rloop']
      human_insert_form_coffee:
        files: ['coffee/packages/human-insert-form/**/*.coffee']
        tasks: ['build_human_insert_form']
      human_insert_form_jade:
        files: ['jade/packages/human-insert-form/**/*.jade']
        tasks: ['jade:human_insert_form']
      human_insert_form_stylus:
        files: ['stylus/packages/human-insert-form/**/*.styus']
        tasks: ['stylus:human_insert_form']
      core_layout_coffee:
        files: ['coffee/packages/core-layout/**/*.coffee']
        tasks: ['build_core_layout']
      core_layout_jade:
        files: ['jade/packages/core-layout/**/*.jade']
        tasks: ['jade:core_layout']
      core_layout_stylus:
        files: ['stylus/packages/core-layout/**/*.stylus']
        tasks: ['stylus:core_layout']
      client_j:
        files: ['coffee/client/**/*.coffee']
        tasks: ['build_j']
      client_b:
        files: ['coffee/lib/**/*.coffee']
        tasks: ['build_b']
      client_h:
        files: ['jade/*.jade']
        tasks: ['build_h']
      client_c:
        files: ['stylus/*.stylus']
        tasks: ['build_c']

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-newer')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.registerTask('default', ['coffeelint:server', 'coffee:server', 'jshint:server'])
  grunt.registerTask('g', ['coffeelint:Grunt', 'coffee:Grunt', 'jshint:Grunt'])
  grunt.registerTask('build_j', ['coffeelint:client', 'coffee:client', 'jshint:client'])
  grunt.registerTask('build_b', ['coffeelint:lib', 'coffee:lib', 'jshint:lib'])
  grunt.registerTask('build_rloop', ['coffeelint:rloop', 'coffee:rloop', 'jshint:rloop'])
  grunt.registerTask('build_human_insert_form', ['coffeelint:human_insert_form', 'coffee:human_insert_form', 'jshint:human_insert_form'])
  grunt.registerTask('build_core_layout', ['coffeelint:core_layout', 'coffee:core_layout', 'jshint:core_layout'])
  grunt.registerTask('build_h', ['jade:client'])
  grunt.registerTask('build_c', ['stylus:client'])
  grunt.registerTask('build_r', ['jade:route'])
  grunt.registerTask('build_v', ['concat:vendor','uglify:vendor', 'cssmin:vendor'])