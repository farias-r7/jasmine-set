module.exports = function(grunt) {

  grunt.initConfig({
    jasmine_node: {
      extensions: 'coffee'
    },
    coffee: {
      dist: {
        files: {
          'jasmine-set.js': './src/set.coffee'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', 'jasmine_node');
  grunt.registerTask('build', ['coffee:dist']);
};
