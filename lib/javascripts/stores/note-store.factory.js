// Tracks state of recorded 'notes'

let angular = require('angular')

angular.module('urlsampler').factory('NoteStore', NoteStore)

NoteStore.$inject = [ '$interval', 'Time' ]

function NoteStore ($interval, Time) {

  let factory = {
    clearNotes: () => { factory.notes = [] },
    ellapsedTime,
    getAllNotesBySample,
    lengthInMillis: 60000,
    notes: [],
    play,
    _stopActiveNoteIfEnded: stopActiveNoteIfEnded
  }

  return factory

  /////////////////////////////////////

  function addToActiveNotes (activeNotes, note) {
    let notes = [ ...activeNotes ].concat(note)

    return notes.sort(function (a, b) {
      return (a.endTimestamp > b.endTimestamp)
    })
  }

  function ellapsedTime () {
    let now = Time.now()

    if (factory.playStartTime) {
      return now - factory.playStartTime
    }

    return 0
  }

  function getAllNotesBySample (sample) {
    if (sample) {
      return this.notes.reduce((list, note) => {
        if (note.sample.key === sample.key && note.sample.url === sample.url) {
          list.push(note)
        }

        return list
      }, [])
    }

    return this.notes
  }

  // FIXME - Write some tests
  function play (stopFn) {
    let currentNote = 0
    let activeNotes = []

    factory.playStartTime = Time.now()

    function playNotes () {
      let currentTime = Time.now()
      let currentTimestamp = currentTime - factory.playStartTime
      let note = factory.notes[currentNote]

      activeNotes = stopActiveNoteIfEnded(activeNotes, currentTimestamp)

      if (note === undefined && activeNotes.length === 0 && stopFn) {
        return stopFn()
      }

      if (note && (note.timestamp <= currentTimestamp)) {
        note.play()
        activeNotes = addToActiveNotes(activeNotes, note)
        currentNote += 1
      }
    }

    return $interval(playNotes, 1)
  }

  function stopActiveNoteIfEnded (activeNotes, timestamp) {
    let notes = [ ...activeNotes ]
    let note = notes[0]

    if (note && (note.endTimestamp <= timestamp)) {
      if (!note.sample.openEnded) {
        note.howl.sound.stop(note.howl.soundId)
      }
      notes.shift()
      note.sample.active = false
    }

    return notes
  }

}
