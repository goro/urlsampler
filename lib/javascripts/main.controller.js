let angular = require('angular')

angular.module('urlsampler').controller('MainCtrl', MainCtrl)

MainCtrl.$inject = [ '$scope', 'SampleStore', 'NoteStore', 'Player' ]

function MainCtrl ($scope, SampleStore, NoteStore, Player) {
  var ctrl = this

  ctrl.samples = SampleStore.activeSamples
  ctrl.composition = NoteStore
  ctrl.player = Player

  init()

  ctrl.range = function (n) {
    return new Array(n)
  }

  function init () {
    SampleStore.preloadSamples($scope)
  }

}
