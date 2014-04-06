/*global module:false*/
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON("package.json"),

    copy: {
      script: {
        src: "src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx",
        dest: "dist/<%= pkg.name %>.jsx",
      },
      scriptdev: {
        src: "src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx",
        dest: "dist/<%= pkg.name %>.build.<%= pkg.version %>.jsx",
      }
    },

    /**
     * wrap into anonymous function
     */
    // wrap: {
    //   script: {
    //     src: ['src/tmp/<%= pkg.name %>.copy.concat.<%= pkg.version %>.jsx'],
    //     dest: 'dist/<%= pkg.name %>.build.<%= pkg.version %>.jsx',
    //     options: {
    //       wrapper: ['(function(thisObj) {', '})(this);\n']
    //     },
    //   }
    // },
    /**
     * concat all the pieces into whan file ready for wrapping
     * @type {Object}
     */
    concat: {
      dist: {
        options: {
          stripBanners: true,
          banner: '\n/*! <%= pkg.name %>.jsx - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
          nonull: true,
          separator: '\n',
        },

        src: [
          "src/CSV.jsx",
          // "src/lib/extendscript.geo/dist/extendscript.geo.ae.jsx",
          // // "src/tmp/json2.min.js",
          // "src/locations/SettingsControl.jsx",
          // "src/tmp/<%= pkg.name %>.copy.<%= pkg.version %>.jsx"
        ],

        dest: "src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx",
      }
    },

    watch: {
      files: ['src/*.jsx', 'src/*.js'],
      tasks: ['concat:dist', 'copy:script', 'copy:scriptdev']
    }

  });
  // These plugins provide necessary tasks.
  // Default task.
  //
  // // This is required if you use any options.
  grunt.task.run('notify_hooks');

  grunt.registerTask('build-dist', ['concat:dist', 'copy:script']);
  grunt.registerTask('build-dev', ['concat:dist', 'copy:scriptdev']);

  // Default task.
  grunt.registerTask('default', ['watch']);
};