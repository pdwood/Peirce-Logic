"use strict"

module.exports = (grunt) ->
	# Load grunt tasks automatically
	require("load-grunt-tasks") grunt

	# Time how long tasks take. Can help when optimizing build times
	require("time-grunt") grunt

	# Define the configuration for all the tasks
	grunt.initConfig
		jshint:
			options:
				jshintrc: ".jshintrc"
				reporter: require("jshint-stylish")

			all: ["appengine/js/**/*.js"]

		gae:
			run_sync: {
				action: 'run'
			}
			options: {
				path: 'appengine'
				args: {
					host: '0.0.0.0'
				}
			}

	grunt.registerTask 'default', ['gae']
