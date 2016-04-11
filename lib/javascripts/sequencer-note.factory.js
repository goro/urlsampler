let angular = require('angular')

angular.module('urlsampler').factory('SequencerNote', SequencerNote)

SequencerNote.$inject = [ 'SampleStore' ]

function SequencerNote (SampleStore) {

  let factory = function (args) {
    this.sample = args.sample
    this.timestamp = args.timestamp
    this.active = true
    this.keyCode = args.keyCode
  }

  factory.prototype.play = function (timestamp) {
    let howl = SampleStore.play(this.sample)

    this.sample.active = true

    if (this.endTimestamp) {
      this.howl = howl
    }
  }

  return factory

}
