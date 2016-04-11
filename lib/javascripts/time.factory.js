let angular = require('angular')

angular.module('urlsampler').factory('Time', Time)

function Time () {

  let factory = {
    now
  }

  return factory

  //////////////////////////

  function now () {
    return new Date().getTime()
  }

}
