// Tracks playing/stopped state of sounds

let angular = require('angular')

angular.module('urlsampler').factory('SoundStore', SoundStore)

function SoundStore () {

  let factory = {
    activate,
    activeSounds: [],
    deactivate
  }

  return factory

  //////////////////////////////

  function activate (sounds, sound) {
    return [ ...sounds ].concat(sound)
  }

  function deactivate (sounds, keyCode) {
    let sound = sounds.filter((activeSound) => {
      return activeSound.keyCode === keyCode
    })[0]

    if (sound && sound.howl) {
      let howl = sound.howl

      if (howl.sound && sound.sample && !sound.sample.openEnded) {
        howl.sound.stop(howl.soundId)
      }
    }

    sounds = sounds.filter((activeSound) => {
      return activeSound.keyCode !== keyCode
    })

    return sounds
  }

}
