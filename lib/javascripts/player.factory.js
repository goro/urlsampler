let angular = require('angular')

angular.module('urlsampler').factory('Player', Player)

Player.$inject = [ '$interval', 'NoteStore', 'SequencerNote', 'Time' ]

function Player ($interval, NoteStore, SequencerNote, Time) {

  let playback

  let factory = {
    captureIfRecording,
    currentStatus: () => { return factory.status },
    endNote,
    endNotesWithKeyCode,
    play,
    record,
    recordingStartTime: null,
    recordingExists,
    setRecordingStartTime: () => { factory.recordingStartTime = new Date().getTime() },
    setStatus: (str) => { factory.status = str },
    status: null,
    startNoteStorePlayback: (stopFn) => { playback = NoteStore.play(stopFn) },
    stop
  }

  return factory

  ////////////////////////////

  function captureIfRecording (sample, keyCode) {
    if (factory.currentStatus() === 'Recording' && sample.url) {
      let currentTime = Time.now()

      if (!factory.recordingExists()) {
        factory.recordingStartTime = Time.now()
      }

      let note = new SequencerNote({
        sample: sample,
        timestamp: currentTime - factory.recordingStartTime,
        keyCode: keyCode
      })

      NoteStore.notes.push(note)

      return note
    }
  }

  function endNote (note) {
    let currentTime = Time.now()

    if (factory.currentStatus() === 'Recording' && note) {
      note.endTimestamp = currentTime - factory.recordingStartTime
      delete note.active
    }
  }

  function endNotesWithKeyCode (keyCode) {
    let currentTime = Time.now()
    let endTimestamp = currentTime - factory.recordingStartTime

    if (factory.currentStatus() === 'Recording' && keyCode) {
      let activeNotes = NoteStore.notes.filter((note) => {
        return note.active && note.keyCode === keyCode
      })

      activeNotes.forEach(function (note) {
        note.endTimestamp = endTimestamp
        delete note.active
      })
    }
  }

  function play () {
    if (factory.currentStatus() !== 'Stopped') {
      return factory.stop()
    }

    factory.setStatus('Playing')
    factory.startNoteStorePlayback(factory.stop)
  }

  function recordingExists () {
    if (NoteStore.notes.length > 0) {
      return true
    }
  }

  function record () {
    NoteStore.clearNotes()
    factory.setStatus('Recording')
  }

  function stop () {
    if (factory.currentStatus() === 'Stopped') {
      NoteStore.playStartTime = null
    } else {
      factory.setStatus('Stopped')
      $interval.cancel(playback)
    }
  }

}
