describe('SoundStore', () => {

  beforeEach(angular.mock.module('urlsampler'))

  let SoundStore

  beforeEach(inject(function(_SoundStore_) {
    SoundStore = _SoundStore_
    SoundStore.activeSounds = [
      { keyCode: 49 },
      { keyCode: 50 }
    ]
  }))

  describe('activate', () => {
    it('returns new array with new sound added', () => {
      let actual = SoundStore.activate(SoundStore.activeSounds, { keyCode: 51 })
      let expected = [
        { keyCode: 49 },
        { keyCode: 50 },
        { keyCode: 51 }
      ]

      expect(actual).toEqual(expected)
    })
  })

  describe('deactivate', () => {
    it('returns a new array with the sound removed', () => {
      let actual = SoundStore.deactivate(SoundStore.activeSounds, 50)
      let expected = [
        { keyCode: 49 }
      ]

      expect(actual).toEqual(expected)
    })

    it('calls stop on sound.howl.sound using sound.howl.soundId if sound is not open-ended', () => {
      SoundStore.activeSounds = [
        { keyCode: 49 },
        {
          keyCode: 50,
          sample: {},
          howl: {
            sound: {
              stop: () => {}
            },
            soundId: 123
          }
        }
      ]
      spyOn(SoundStore.activeSounds[1].howl.sound, 'stop')
      SoundStore.deactivate(SoundStore.activeSounds, 50)
      expect(SoundStore.activeSounds[1].howl.sound.stop).toHaveBeenCalledWith(123)
    })

    it('does not call stop on sound.howl.sound if sound is open-ended', () => {
      SoundStore.activeSounds = [
        {  keyCode: 49 },
        {
          keyCode: 50,
          sample: {
            openEnded: true
          },
          howl: {
            sound: {
              stop: () => {}
            },
            soundId: 123
          }
        }
      ]
      spyOn(SoundStore.activeSounds[1].howl.sound, 'stop')
      SoundStore.deactivate(SoundStore.activeSounds, 50)
      expect(SoundStore.activeSounds[1].howl.sound.stop).not.toHaveBeenCalledWith(123)
    })
  })

})
