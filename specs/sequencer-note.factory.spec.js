describe('SequencerNote', () => {

  beforeEach(angular.mock.module('urlsampler'))

  let SequencerNote
  let SampleStore

  beforeEach(inject(function(_SequencerNote_, _SampleStore_) {
    SequencerNote = _SequencerNote_
    SampleStore = _SampleStore_
  }))

  describe('play', () => {

    it('calls play on SampleStore', () => {
      spyOn(SampleStore, 'play').and.returnValue(true)
      let note = new SequencerNote({
        sample: {},
        timestamp: 1234,
        keyCode: 1
      })
      note.play()
      expect(SampleStore.play).toHaveBeenCalled()
    })

    it('sets sample to active', () => {
      spyOn(SampleStore, 'play').and.returnValue(true)

      let note = new SequencerNote({
        sample: { active: false },
        timestamp: 1234,
        keyCode: 1
      })

      note.play()

      let actual = note.sample.active
      let expected = true

      expect(actual).toEqual(expected)
    })

    it('sets howl if it has timestamp', () => {
      spyOn(SampleStore, 'play').and.returnValue('howl')

      let note = new SequencerNote({
        sample: { active: false },
        timestamp: 1234,
        keyCode: 1
      })

      note.endTimestamp = 1235

      note.play()

      let actual = note.howl
      let expected = 'howl'

      expect(actual).toEqual(expected)
    })
  })

})
