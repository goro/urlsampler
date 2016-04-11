describe('KeyStore', () => {

  beforeEach(angular.mock.module('urlsampler'))

  let KeyStore
  let SampleStore

  beforeEach(inject(function(_KeyStore_, _SampleStore_) {
    KeyStore = _KeyStore_
    SampleStore = _SampleStore_
  }))

  beforeEach(() => {
    SampleStore.activeSamples = [
      { keyCode: '49' },
      { keyCode: '50' }
    ]
  })

  describe('activate', () => {
    it('does not call callback if invalid keyCode', () => {
      let mock = {
        callback: () => {}
      }
      spyOn(mock, 'callback')

      KeyStore.activate([ '49' ], '23', mock.callback)

      expect(mock.callback).not.toHaveBeenCalledWith(['49', '50'])
    })

    describe('if key is not in array of keys', () => {
      it('calls the callback with the array of keys with new key', () => {
        let mock = {
          callback: () => {}
        }
        spyOn(mock, 'callback')

        KeyStore.activate([ '49' ], '50', mock.callback)

        expect(mock.callback).toHaveBeenCalledWith(['49', '50'])
      })
    })
  })

  describe('deactivate', () => {
    it('does not call callback if invalid keyCode', () => {
      let mock = {
        callback: () => {}
      }
      spyOn(mock, 'callback')

      KeyStore.activate([ '49' ], '12', mock.callback)

      expect(mock.callback).not.toHaveBeenCalled()
    })

    it('calls callback with array of keys minus entered key', () => {
      let mock = {
        callback: () => {}
      }
      spyOn(mock, 'callback')

      KeyStore.activate([ '49' ], '50', mock.callback)

      expect(mock.callback).not.toHaveBeenCalledWith([ '49' ])
    })
  })

})
