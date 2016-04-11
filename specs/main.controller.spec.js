describe('MainController', () => {

  let $controller
  let $rootScope
  let SampleStore
  let controllerScope

  beforeEach(angular.mock.module('urlsampler'))

  beforeEach(inject(function (_$controller_, _$rootScope_, _SampleStore_) {
    $rootScope = _$rootScope_
    controllerScope = $rootScope.$new()
    SampleStore = _SampleStore_
    spyOn(SampleStore, 'preloadSamples').and.returnValue(true)

    $controller = _$controller_('MainCtrl', {
      $scope: controllerScope
    });
  }))

  describe('init', () => {
    it('calls preloadSamples on SampleStore on init()', () => {
      controllerScope.$digest()
      expect(SampleStore.preloadSamples).toHaveBeenCalled()
    })
  })

  describe('range', () => {
    it('returns a range of numbers based on what\'s passed in', () => {
      let actual = $controller.range(10).length
      let expected = 10

      expect(actual).toEqual(expected)
    })
  })

})
