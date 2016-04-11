import angular from 'angular'
import uiRouter from 'angular-ui-router'

var app = angular.module('urlsampler', [ uiRouter ])

routing.$inject = [ '$stateProvider', '$urlRouterProvider', '$locationProvider' ]

function routing ($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true)

  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('drum-machine', {
      url: '/',
      templateUrl: 'templates/drum-machine.html',
      controller: 'MainCtrl as ctrl'
    })

    .state('sequencer', {
      url: '/sequencer',
      templateUrl: 'templates/sequencer.html',
      controller: 'MainCtrl as ctrl'
    })
}

app.config(routing)

require('./stores/key-store.factory.js')
require('./stores/note-store.factory.js')
require('./stores/sample-store.factory.js')
require('./stores/sound-store.factory.js')

require('./elements/drum-pad.directive.js')
require('./elements/sample.directive.js')
require('./elements/sequencer-note.directive.js')
require('./elements/time-line.directive.js')

require('./sequencer-note.factory.js')
require('./player.factory.js')
require('./time.factory.js')
require('./sound-file.factory.js')

require('./main.controller.js')
