let angular = require('angular')

angular.module('urlsampler').directive('timeLine', timeLine)

timeLine.$inject = [ 'NoteStore' ]

function timeLine (NoteStore) {

  function link (scope, el, attrs) {

    scope.leftPx = function () {
      let ellapsedTime = NoteStore.ellapsedTime()
      let roundedSeconds = Math.round((ellapsedTime / 1000) * 100) / 100
      let pxsPerSecond = 84
      let pxs = `${roundedSeconds * pxsPerSecond}px`
      return pxs
    }
  }

  return {
    replace: true,
    scope: {},
    restrict: 'E',
    link: link,
    templateUrl: '/templates/time-line.html'
  }

}
