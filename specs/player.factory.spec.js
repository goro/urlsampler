describe('Player', () => {

  beforeEach(angular.mock.module('urlsampler'))

  let Player
  let NoteStore
  let SequencerNote
  let Time
  let $interval

  beforeEach(inject((_$interval_, _Player_, _NoteStore_, _SequencerNote_, _Time_) => {
    Player = _Player_
    NoteStore = _NoteStore_
    SequencerNote = _SequencerNote_
    Time = _Time_
    $interval = _$interval_
  }))

  describe('captureIfRecording', () => {
    it('does not add new note to NoteStore if not recording', () => {
      Player.setStatus('Playing')
      spyOn(NoteStore.notes, 'push')
      Player.captureIfRecording({}, 123)
      expect(NoteStore.notes.push).not.toHaveBeenCalled()
    })

    it('adds new note to NoteStore if recording', () => {
      Player.setStatus('Recording')
      spyOn(NoteStore.notes, 'push')
      let sampleMock = {
        url: 'example.com'
      }
      Player.captureIfRecording(sampleMock, 123)

      expect(NoteStore.notes.push).toHaveBeenCalled()
    })

    it('returns new note', () => {
      Player.setStatus('Recording')
      spyOn(NoteStore.notes, 'push')
      let sampleMock = {
        url: 'example.com'
      }
      let actual = Player.captureIfRecording(sampleMock, 123)
      let expected = new SequencerNote({ sample: { url: 'example.com' }, timestamp: 0, active: true, keyCode: 123 })

      expect(actual).toEqual(expected)
    })
  })

  describe('endNote', () => {
    it('sets note as inactive', () => {
      let noteMock = { active: true }
      Player.setStatus('Recording')
      Player.endNote(noteMock)
      let actual = noteMock.active

      expect(actual).toEqual(undefined)
    })

    it('does not set note as inactive if Playing', () => {
      let noteMock = { active: true }
      Player.setStatus('Playing')
      Player.endNote(noteMock)
      let actual = noteMock.active

      expect(actual).toEqual(true)
    })

    it('sets correct note endTimestamp', () => {
      let noteMock = { active: true }
      spyOn(Time, 'now').and.returnValue(2000)
      Player.recordingStartTime = 1234
      Player.setStatus('Recording')
      Player.endNote(noteMock)
      let actual = noteMock.endTimestamp
      let expected = 766

      expect(actual).toEqual(expected)
    })
  })

  describe('endNotesWithKeyCode', () => {
    it('deactivates all notes with keyCode if recording', () => {
      Player.setStatus('Recording')
      spyOn(Time, 'now').and.returnValue(1000)
      NoteStore.notes = [
        { active: true, keyCode: 123 },
        { active: true, keyCode: 123 }
      ]

      Player.endNotesWithKeyCode(123)
      let actual = NoteStore.notes
      let expected = [
        { keyCode: 123, endTimestamp: 1000 },
        { keyCode: 123, endTimestamp: 1000 }
      ]

      expect(actual).toEqual(expected)
    })

    it('does not deactive all notes with keyCode if not recording', () => {
      Player.setStatus('Playing')
      spyOn(Time, 'now').and.returnValue(1000)
      NoteStore.notes = [
        { active: true, keyCode: 123 },
        { active: true, keyCode: 123 }
      ]

      Player.endNotesWithKeyCode(123)
      let actual = NoteStore.notes
      let expected = [
        { keyCode: 123, active: true  },
        { keyCode: 123, active: true  }
      ]

      expect(actual).toEqual(expected)
    })
  })

  describe('play', () => {
    it('stops player if current status is not Stopped', () => {
      Player.setStatus('Playing')
      Player.play()
      let actual = Player.status
      let expected = 'Stopped'

      expect(actual).toEqual(expected)
    })

    it('sets status to Playing', () => {
      Player.setStatus('Stopped')
      Player.play()
      let actual = Player.status
      let expected = 'Playing'

      expect(actual).toEqual(expected)
    })

    it('starts NoteStore playback', () => {
      spyOn(NoteStore, 'play')
      Player.setStatus('Stopped')
      Player.play()

      expect(NoteStore.play).toHaveBeenCalled()
    })
  })

  describe('recordingExists', () => {
    it('returns true if NotesStore has notes', () => {
      NoteStore.notes = [ 'foo', 'bar' ]
      let actual = Player.recordingExists()
      let expected = true

      expect(actual).toEqual(expected)
    })

    it('returns false if NotesStore has no notes', () => {
      NoteStore.notes = []
      let actual = Player.recordingExists()

      expect(actual).toBeFalsy()
    })
  })

  describe('record', () => {
    it('calls clearNotes on NoteStore', () => {
      spyOn(NoteStore, 'clearNotes')
      Player.record()
      expect(NoteStore.clearNotes).toHaveBeenCalled()
    })

    it('sets status to Recording', () => {
      Player.record()
      let actual = Player.status
      let expected = 'Recording'

      expect(actual).toEqual(expected)
    })
  })

  describe('stop', () => {
    it('sets NoteStore playStartTime to null if status is Stopped already', () => {
      NoteStore.playStartTime = 1234
      Player.setStatus('Stopped')
      Player.stop()
      let actual = NoteStore.playStartTime
      let expected = null

      expect(actual).toEqual(expected)
    })

    it('sets status to Stopped if Playing', () => {
      Player.setStatus('Playing')
      Player.stop()
      let actual = Player.status
      let expected = 'Stopped'

      expect(actual).toEqual(expected)
    })

    it('calls cancel on $interval', () => {
      spyOn($interval, 'cancel')
      Player.setStatus('Playing')
      Player.stop()
      expect($interval.cancel).toHaveBeenCalled()
    })
  })

})
