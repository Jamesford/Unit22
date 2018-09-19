const Track = require('./Track')

class Queue {
  constructor () {
    this._list = []
  }

  isEmpty () {
    return this._list.length < 1
  }

  list () {
    return this._list.map((t, i) => `${++i}. ${t.title}`)
  }

  // info is the object returned by ytdl.getInfo
  add (info) {
    const track = new Track(info)
    this._list = [
      ...this._list,
      track
    ]
  }

  remove (i) {
    const removed = this._list[i]
    this._list = [
      ...this._list.slice(0, i),
      ...this._list.slice(++i)
    ]
    return removed
  }

  next () {
    if (this.isEmpty()) return null
    const next = this._list[0]
    this._list = [
      ...this._list.slice(1)
    ]
    return next
  }
}

module.exports = Queue
