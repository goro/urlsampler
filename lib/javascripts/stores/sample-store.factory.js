// Tracks state of URLs/samples

let angular = require('angular')

angular.module('urlsampler').factory('SampleStore', SampleStore)

SampleStore.$inject = [ 'SoundStore', 'SoundFile' ]

function SampleStore (SoundStore, SoundFile) {

  const URL = 'localhost:8080'

  const SAMPLES = [
    { key: '1', keyCode: 49, name: 'Kick', openEnded: true, url: 'https://www.freesound.org/data/previews/195/195396_3172867-lq.mp3' },
    { key: '2', keyCode: 50, name: 'Snare', openEnded: true, url: 'https://www.freesound.org/data/previews/100/100396_377011-lq.mp3' },
    { key: '3', keyCode: 51, name: 'Cymbal', url: 'https://www.freesound.org/data/previews/121/121097_2193266-lq.mp3' },
    { key: '4', keyCode: 52, name: 'Open Hihat', openEnded: true, url: 'https://www.freesound.org/data/previews/207/207914_19852-lq.mp3' },
    { key: 'Q', keyCode: 81, name: 'Closed Hihat', openEnded: true, url: 'https://www.freesound.org/data/previews/13/13246_36719-lq.mp3' },
    { key: 'W', keyCode: 87, name: '', url: '' },
    { key: 'E', keyCode: 69, name: '', url: '' },
    { key: 'R', keyCode: 82, name: '', url: '' },
    { key: 'A', keyCode: 65, name: '', url: '' },
    { key: 'S', keyCode: 83, name: '', url: '' },
    { key: 'D', keyCode: 68, name: '', url: '' },
    { key: 'F', keyCode: 70, name: '', url: '' },
    { key: 'Z', keyCode: 90, name: '', url: '' },
    { key: 'X', keyCode: 88, name: '', url: '' },
    { key: 'C', keyCode: 67, name: '', url: '' },
    { key: 'V', keyCode: 86, name: '', url: '' }
  ]

  let howler = require('howler')

  let factory = {
    activate,
    deactivate,
    findSampleByKey,
    formatSampleUrl,
    play,
    preloadSample,
    preloadSamples,
    activeSamples: SAMPLES,
    stop
  }

  return factory

  ///////////////////////////

  function activate (keyCode) {
    let sample = factory.findSampleByKey(keyCode)

    if (!sample) { return }

    let howl = factory.play(sample)

    let sound = { howl, keyCode, sample }

    if (sample && sample.loaded) {
      sound.sample.active = true
    }

    SoundStore.activeSounds = SoundStore.activate(SoundStore.activeSounds, sound)

    return sound.sample
  }

  function deactivate (keyCode) {
    let sample = factory.findSampleByKey(keyCode)

    if (sample && sample.loaded) {
      sample.active = false
    }

    SoundStore.activeSounds = SoundStore.deactivate(SoundStore.activeSounds, keyCode)

    return sample
  }

  function findSampleByKey (keyCode) {
    return factory.activeSamples.filter((sample) => {
      return parseInt(sample.keyCode, 10) === parseInt(keyCode, 10)
    })[0]
  }

  function formatSampleUrl (url) {
    return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
  }

  function play (sample) {
    if (sample !== undefined) {
      let sound = SoundFile.create({
        src: [ sample.url ]
      })

      let soundId = sound.play()

      return {
        sound,
        soundId
      }
    }
  }

  function preloadSample (sample, fn) {
    if (!sample.url) {
      return false
    }

    let sound = SoundFile.create({
      src: [ sample.url ],
      volume: 0,
      onload: fn
    })

    return sound.play()
  }

  function preloadSamples (scope) {
    let samples = factory.activeSamples
    let that = factory

    samples.forEach((sample) => {
      that.preloadSample(sample, () => {
        scope.$apply(function () {
          sample.loaded = true
        })
      })
    })
  }

  function stop (howl, sample) {
    if (howl && howl.sound && !sample.openEnded) {
      howl.sound.stop(howl.soundId)
    }
  }


}
