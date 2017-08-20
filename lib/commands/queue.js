const ytdl = require('ytdl-core')

// !q list
// !q remove <int>
// !q <video>

class Video {
  constructor (info) {
    this.title = info.title
    this.url = info.video_url
  }
}

class Queue {
  constructor () {
    this._list = []
  }

  empty () {
    return this._list.length < 1
  }

  list () {
    return this._list.map((v, i) => `${++i}. ${v.title}`)
  }

  add (info) {
    const video = new Video(info)
    this._list.push(video)
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
    if (this.empty()) return null
    return this._list.shift()
  }
}

queues = {}
exports.Queues = queues

exports.list = (message) => {
  const { id } = message.member.guild
  if (!queues[id] || queues[id].empty()) return message.channel.send('No Queue')
  const list = queues[id].list()
  return message.channel.send(list.join('\n'))
}

exports.remove = (message, int) => {
  const { id } = message.member.guild
  if (!queues[id] || queues[id].empty()) return message.channel.send('No Queue')
  const removed = queues[id].remove(--int)
  message.channel.send(`Removed: ${removed.title}`)
  const list = queues[id].list()
  return message.channel.send(`Updated Queue\n${list.join('\n')}`)
}

exports.add = async (message, url) => {
  let info
  try {
    info = await ytdl.getInfo(url)    
  } catch (error) {
    console.error(error)
  }
  if (!info) return message.channel.send('I can\'t play that video :confounded:')

  const { id } = message.member.guild
  if (!queues[id]) {
    queues[id] = new Queue()
  }
  queues[id].add(info)

  message.channel.send(`:radio: Queued - ${info.title}`)
}
