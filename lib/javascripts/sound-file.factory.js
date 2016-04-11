let angular = require('angular')

angular.module('urlsampler').factory('SoundFile', SoundFile)

import { Howl } from 'howler/howler.min.js'

function SoundFile () {

  return {
    create
  }

  /////////////////////////

  function create (args) {
    return new Howl(args)
  }

}
