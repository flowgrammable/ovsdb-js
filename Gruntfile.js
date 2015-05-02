
module.exports = function(grunt) {

grunt.initConfig({
  jshint: {
    all: ['Gruntfile.js', 'lib/**/*.js', '!lib/grammar.js']
  },
  mochaTest: {
    test: {
      src: ['test/**/*.js']
    }
  },
  watch: {
    scripts: {
      files: ['lib/**/*.js', 'lib/grammar.y', '!lib/grammar.js',
              'test/**/*.pass', 'test/**/*.fail'],
      tasks: ['default'],
      options: {
        spawn: false,
      },
    },
  },
  shell: {
    set_ovs_manager: {
      command: 'sudo ovs-vsctl set-manager ptcp:6640'
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-shell');

grunt.registerTask('default', ['jshint', 'mochaTest']);
grunt.registerTask('test', ['shell:set_ovs_manager','mochaTest']);

};
