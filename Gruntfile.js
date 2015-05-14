module.exports = function(grunt) {

  grunt.initConfig({
    jasmine_node: {
      extensions: 'coffee'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.registerTask('test', 'jasmine_node');
  grunt.registerTask('default', 'jasmine_node');
};
