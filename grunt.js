module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      name: '<%= pkg.name.replace(/-/g, " ") %>',
      repo: 'https://github.com/MayhemYDG/4chan-x/',
      files: {
        metajs:   '4chan_x.meta.js',
        userjs:   '4chan_x.user.js',
        latestjs: 'latestv3.js'
      }
    },
    concat: {
      coffee: {
        src: [
          '<file_template:src/config.coffee>',
          '<file_template:src/globals.coffee>',
          '<file_template:lib/ui.coffee>',
          '<file_template:lib/$.coffee>',
          '<file_template:lib/polyfill.coffee>',
          '<file_template:src/features.coffee>',
          '<file_template:src/qr.coffee>',
          '<file_template:src/main.coffee>'
        ],
        dest: 'tmp/script.coffee'
      },
      script: {
        src: ['<file_template:src/metadata.js>', '<file_template:src/banner.js>', 'tmp/script.js'],
        dest: '<config:meta.files.userjs>'
      },
      meta: {
        src:  '<file_template:src/metadata.js>',
        dest: '<config:meta.files.metajs>'
      },
      latest: {
        src:  '<file_template:src/latest.js>',
        dest: '<config:meta.files.latestjs>'
      }
    },
    coffee: {
      script: {
        src:  'tmp/script.coffee',
        dest: 'tmp/script.js'
      }
    },
    exec: {
      commit: {
        command: function(grunt) {
          var name, release, version;
          name    = grunt.config(['pkg', 'name']).replace(/-/g, ' ');
          version = grunt.config(['pkg', 'version']);
          release = name + ' v' + version;
          return [
            'git checkout master',
            'git commit -am "Release ' + release + '."',
            'git tag -a ' + version + ' -m "' + release + '"',
            'git tag -af stable -m "' + release + '"'
          ].join(' && ');
        },
        stdout: true
      },
      push: {
        command: 'git push && git push --tags',
        stdout: true
      }
    },
    watch: {
      files: [
        'grunt.js',
        'lib/**/*.coffee',
        'src/**/*.coffee',
        'src/**/*.js',
        'css/**/*.css',
        'img/*'
      ],
      tasks: 'default'
    },
    clean: {
      tmp:['tmp']
    },
    qunit: {
      all: 'http://localhost:8000/test/index.html'
    },
    server: {
      port: 8000,
      base: '.'
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', 'concat:coffee coffee:script concat:script clean');
  grunt.registerTask('release', 'concat:meta concat:latest default exec:commit exec:push');
  grunt.registerTask('patch',   'bump');
  grunt.registerTask('upgrade', 'bump:minor');
  grunt.registerTask('test',    'default server qunit');

};