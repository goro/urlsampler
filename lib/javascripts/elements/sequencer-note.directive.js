let angular = require('angular')

angular.module('urlsampler').directive('sequencerNote', sequencerNote)

sequencerNote.$inject = [ 'NoteStore' ]

function sequencerNote (NoteStore) {

  function link (scope, el, attrs) {

    scope.leftPx = `${((scope.note.timestamp / 1000) * 84)}px`

    scope.setAsSelectedNote = function () {
      NoteStore.selectedNote = scope.note
    }

    scope.isSelectedNote = function () {
      return NoteStore.selectedNote === scope.note
    }

  }

  return {
    scope: {
      note: '='
    },
    link: link,
    replace: true,
    restrict: 'E',
    templateUrl: './templates/sequencer-note.html'
  }
}
