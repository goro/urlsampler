describe('NoteStore', () => {

  beforeEach(angular.mock.module('urlsampler'))

  let NoteStore
  let Time

  beforeEach(inject(function(_NoteStore_, _Time_) {
    NoteStore = _NoteStore_
    Time = _Time_
  }))

  describe('clearNotes', () => {
    it('clears notes', () => {
      NoteStore.notes = [ 'foo' ]

      NoteStore.clearNotes()
      let actual = NoteStore.notes
      let expected = []

      expect(actual).toEqual(expected)
    })
  })

  describe('ellapsedTime', () => {
    it('returns time between now and when play started', () => {
      spyOn(Time, 'now').and.returnValue(1234)
      NoteStore.playStartTime = 1000
      let actual = NoteStore.ellapsedTime()
      let expected = 234

      expect(actual).toEqual(expected)
    })

    it('returns 0 if no playStartTime', () => {
      let actual = NoteStore.ellapsedTime()
      let expected = 0

      expect(actual).toEqual(expected)
    })
  })

  describe('getAllNotesBySample', () => {
    it('returns a list of notes using key and url', () => {
      NoteStore.notes = [
        { sample: { key: 1, url: 'http://example.com/foo.mp3' }},
        { sample: { key: 2, url: 'http://example.com/foo2.mp3' }}
      ]
      let actual = NoteStore.getAllNotesBySample({ key: 2, url: 'http://example.com/foo2.mp3' })
      let expected = [ { sample: { key: 2, url: 'http://example.com/foo2.mp3' }} ]

      expect(actual).toEqual(expected)
    })
  })

  describe('stopActiveNoteIfEnded', () => {
    let activeNotes

    beforeEach(() => {
      activeNotes = [
        {
          endTimestamp: 999,
          sample: {
            active: true
          },
          howl: {
            soundId: 123,
            sound: {
              stop: () => {}
            }
          }
        }
      ]
    })

    it('calls stop on first note in list if the endTimestamp is earlier than the passed in one and it is not open-ended', () => {
      spyOn(activeNotes[0].howl.sound, 'stop')
      NoteStore._stopActiveNoteIfEnded(activeNotes, 1000)
      expect(activeNotes[0].howl.sound.stop).toHaveBeenCalledWith(123)
    })

    it('does not call stop on first note in list if it is open-ended', () => {
      activeNotes[0].sample.openEnded = true
      spyOn(activeNotes[0].howl.sound, 'stop')
      NoteStore._stopActiveNoteIfEnded(activeNotes, 1000)
      expect(activeNotes[0].howl.sound.stop).not.toHaveBeenCalledWith(123)
    })

    it('removes the note from the list', () => {
      spyOn(activeNotes[0].howl.sound, 'stop')
      let actual = NoteStore._stopActiveNoteIfEnded(activeNotes, 1000)
      let expected = []

      expect(actual).toEqual(expected)
    })

    it('sets note to inactive', () => {
      NoteStore._stopActiveNoteIfEnded(activeNotes, 1000)
      let actual = activeNotes[0].sample.active
      let expected = false

      expect(actual).toEqual(expected)
    })

  })

})
