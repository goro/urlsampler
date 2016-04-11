let angular = require('angular')
let $ = require('jquery')

angular.module('urlsampler').directive('drumPad', drumPad)

drumPad.$inject = [ '$document', 'SampleStore', 'Player', 'KeyStore' ]

function drumPad ($document, SampleStore, Player, KeyStore) {

  function link (scope, el, attrs) {

    let howl
    let activeNote

    // Mouse version
    $(el).mousedown((e) => {
      howl = SampleStore.play(scope.sample)
      activeNote = Player.captureIfRecording(scope.sample)
    })

    $(el).mouseup((e) => {
      SampleStore.stop(howl, scope.sample)
      Player.endNote(activeNote)
    })

    // Keyboard version
    $($document).keydown((e) => {
      let keyCode = e.keyCode

      KeyStore.activate(KeyStore.activeKeys, keyCode, (keys) => {
        KeyStore.activeKeys = keys

        scope.$apply(() => {
          let sample = SampleStore.activate(keyCode)
          Player.captureIfRecording(sample, keyCode)
        })
      })
    })

    $($document).keyup((e) => {
      let keyCode = e.keyCode

      KeyStore.deactivate(KeyStore.activeKeys, keyCode, (keys) => {
        KeyStore.activeKeys = keys

        scope.$apply(() => {
          SampleStore.deactivate(keyCode)
          Player.endNotesWithKeyCode(keyCode)
        })
      })
    })

  }

  return {
    scope: {
      sample: '=',
      tabIndex: '@'
    },
    replace: true,
    restrict: 'E',
    templateUrl: './templates/drum-pad.html',
    link: link
  }
}
