describe('SampleStore', () => {

  beforeEach(angular.mock.module('urlsampler'))

  let SampleStore
  let SoundStore
  let SoundFile

  beforeEach(inject(function(_SampleStore_, _SoundStore_, _SoundFile_) {
    SampleStore = _SampleStore_
    SoundStore = _SoundStore_
    SoundFile = _SoundFile_
  }))

  beforeEach(() => {
    SampleStore.activeSamples = [
      { key: '1', keyCode: 49, name: 'Kick', openEnded: true, url: 'http://example.com/sounds/kick.mp3', loaded: true },
      { key: '2', keyCode: 50, name: 'Snare', openEnded: true, url: 'http://example.com/sounds/snare.mp3', loaded: true }
    ]
  })

  describe('activate', () => {
    it('calls activate on SoundStore with new sound', () => {
      spyOn(SampleStore, 'play').and.returnValue(true)
      spyOn(SoundStore, 'activate')
      SampleStore.activate(49)

      expect(SoundStore.activate).toHaveBeenCalled()
    })

    it('does not call activate if no sample found', () => {
      spyOn(SampleStore, 'play').and.returnValue(true)
      spyOn(SoundStore, 'activate')
      SampleStore.activate(123)

      expect(SoundStore.activate).not.toHaveBeenCalled()
    })

    it('returns correct sample', () => {
      spyOn(SampleStore, 'play').and.returnValue(true)
      spyOn(SoundStore, 'activate')
      let actual = SampleStore.activate(49)
      let expected = { key: '1', keyCode: 49, name: 'Kick', openEnded: true, url: 'http://example.com/sounds/kick.mp3', loaded: true, active: true }

      expect(actual).toEqual(expected)
    })

    it('sets sample to active', () => {
      spyOn(SampleStore, 'play').and.returnValue(true)
      spyOn(SoundStore, 'activate')
      let actual = SampleStore.activate(49).active
      let expected = true

      expect(actual).toEqual(expected)
    })
  })

  describe('deactivate', () => {
    it('calls deactivate on SoundStore with activeSounds and keyCode', () => {
      spyOn(SoundStore, 'deactivate').and.returnValue(true)
      SoundStore.activeSounds = [ 'foo' ]
      SampleStore.deactivate(49)
      expect(SoundStore.deactivate).toHaveBeenCalledWith([ 'foo' ], 49)
    })

    it('sets sample to inactive', () => {
      spyOn(SoundStore, 'deactivate').and.returnValue(true)
      let actual = SampleStore.deactivate(49).active
      let expected = false

      expect(actual).toEqual(expected)
    })

    it('returns correct sample', () => {
      spyOn(SoundStore, 'deactivate').and.returnValue(true)
      let actual = SampleStore.deactivate(49)
      let expected = { key: '1', keyCode: 49, name: 'Kick', openEnded: true, url: 'http://example.com/sounds/kick.mp3', loaded: true, active: false }

      expect(actual).toEqual(expected)
    })
  })

  describe('findSampleByKey', () => {
    it('returns correct sample', () => {
      let actual = SampleStore.findSampleByKey(49)
      let expected = { key: '1', keyCode: 49, name: 'Kick', openEnded: true, url: 'http://example.com/sounds/kick.mp3', loaded: true }

      expect(actual).toEqual(expected)
    })
  })

  describe('formatSampleUrl', () => {
    it('replaces dropbox URLs with user content URL', () => {
      let actual = SampleStore.formatSampleUrl('http://www.dropbox.com/something.mp3')
      let expected = 'http://dl.dropboxusercontent.com/something.mp3'

      expect(actual).toEqual(expected)
    })
  })

  describe('play', () => {
    it('creates new sound', () => {
      spyOn(SoundFile, 'create').and.returnValue({ play: () => {} })
      SampleStore.play({ url: 'foo' })
      expect(SoundFile.create).toHaveBeenCalledWith({
        src: [ 'foo' ]
      })
    })

    it('calls play on sound', () => {
      let soundMock = { play: () => {} }
      spyOn(SoundFile, 'create').and.returnValue(soundMock)
      spyOn(soundMock, 'play')
      SampleStore.play({ url: 'foo' })
      expect(soundMock.play).toHaveBeenCalled()
    })

    it('returns the sound and soundId', () => {
      let soundMock = { play: () => {} }
      spyOn(SoundFile, 'create').and.returnValue(soundMock)
      spyOn(soundMock, 'play').and.returnValue(1234)
      let actual = SampleStore.play({ url: 'foo' })
      let expected = { sound: soundMock, soundId: 1234 }
      expect(soundMock.play).toHaveBeenCalled()
    })
  })

  describe('preloadSample', () => {
    it('returns false if no sample', () => {
      let actual = SampleStore.preloadSample({})
      let expected = false

      expect(actual).toEqual(expected)
    })

    it('creates new sound', () => {
      let soundMock = { play: () => {} }
      spyOn(SoundFile, 'create').and.returnValue(soundMock)
      SampleStore.preloadSample({ url: 'http://example.com/foo.mp3' })
      expect(SoundFile.create).toHaveBeenCalled()
    })

    it('calls play on new sound', () => {
      let soundMock = { play: () => {} }
      spyOn(soundMock, 'play')
      spyOn(SoundFile, 'create').and.returnValue(soundMock)
      SampleStore.preloadSample({ url: 'http://example.com/foo.mp3' })
      expect(soundMock.play).toHaveBeenCalled()
    })
  })

  describe('preloadSamples', () => {
    it('loops through all activeSamples and preloads them', () => {
      spyOn(SampleStore, 'preloadSample').and.returnValue(true)
      SampleStore.preloadSamples({})
      expect(SampleStore.preloadSample.calls.count()).toEqual(2)
    })
  })

  describe('stop', () => {
    it('calls stop on sound using soundId', () => {
      let soundMock = { sound: { stop: () => {} }, soundId: 123 }
      spyOn(soundMock.sound, 'stop')
      SampleStore.stop(soundMock, { openEnded: false })
      expect(soundMock.sound.stop).toHaveBeenCalledWith(123)
    })

    it('does not call stop on sound with sample is openEnded', () => {
      let soundMock = { sound: { stop: () => {} }, soundId: 123 }
      spyOn(soundMock.sound, 'stop')
      SampleStore.stop(soundMock, { openEnded: true })
      expect(soundMock.sound.stop).not.toHaveBeenCalledWith(123)
    })
  })

})
