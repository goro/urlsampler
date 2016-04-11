// Tracks keystroke states

let angular = require('angular')

KeyStore.$inject = [ 'SampleStore' ]

angular.module('urlsampler').factory('KeyStore', KeyStore)

function KeyStore (SampleStore) {

  let factory = {
    activate,
    activeKeys: [],
    deactivate
  }

  return factory

  //////////////////////////////////

  function activate (keys, key, callback) {
    if (invalidKeyCode(key)) { return }

    if (keys.indexOf(key) === -1) {
      callback([ ...keys].concat(key))
    }
  }

  function deactivate (keys, key, callback) {
    if (invalidKeyCode(key)) { return }

    let updatedKeys = keys.filter((activeKey) => {
      return key !== activeKey
    })

    callback(updatedKeys)
  }

  function invalidKeyCode(key) {
    return validKeyCodes().indexOf(key) === -1
  }

  function validKeyCodes () {
    return SampleStore.activeSamples.map((sample) => sample.keyCode)
  }

}
