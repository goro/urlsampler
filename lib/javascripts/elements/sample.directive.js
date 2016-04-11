let angular = require('angular')

angular.module('urlsampler').directive('sample', sample)

sample.$inject = [ 'SampleStore' ]

function sample (SampleStore) {

  function link (scope, el, attrs) {

    scope.formatAndPreloadSample = () => {
      scope.sample.loaded = SampleStore.preloadSample(scope.sample) ? true : false
      scope.sample.url = SampleStore.formatSampleUrl(scope.sample.url)
    }

  }

  return {
    scope: {
      sample: '='
    },
    replace: true,
    restrict: 'E',
    templateUrl: './templates/sample.html',
    link: link
  }
}
