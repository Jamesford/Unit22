const ytdl = require('ytdl-core')
const Queue = require('./Queue')

class Player {
  constructor (id) {
    // Set on creation
    this.id = id
    this.streamOptions = {
      seek: 0,
      volume: 0.5,
      passes: 1
    }

    // Set when channel is joined
    this.inRoom = false
    this.voiceChannel = null
    this.textChannel = null
    this.connection = null

    // Set when stream begins
    this.dispatcher = null
    this.info = null

    // The queue
    this.queue = new Queue()

    // Bind Functions
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.nowPlaying = this.nowPlaying.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.playTrack = this.playTrack.bind(this)
    this.stopTrack = this.stopTrack.bind(this)
    this.pauseTrack = this.pauseTrack.bind(this)
    this.resumeTrack = this.resumeTrack.bind(this)
    this.getVolume = this.getVolume.bind(this)
    this.setVolume = this.setVolume.bind(this)
    this.queueAdd = this.queueAdd.bind(this)
    this.queueList = this.queueList.bind(this)
    this.queueRemove = this.queueRemove.bind(this)
    this.queueClear = this.queueClear.bind(this)
    this.skipTrack = this.skipTrack.bind(this)
  }

  async onTrackEnd (reason) {
    console.log('onTrackEnd', reason)

    // Reasons that prevent leaveRoom from firing
    if (['stop', 'change'].includes(reason)) {
      // not leaving room due to 'reason'
    } else {
      if (!this.queue.isEmpty()) {
        const next = this.queue.next()
        await this.playTrack(next.url)
      } else {
        this.leaveRoom()
      }
    }
  }

  nowPlaying (message) {
    const response = `:musical_note: Now Playing - ${this.info.title}`

    if (message) {
      message.channel.send(response)
    } else {
      this.textChannel.send(response)
    }
  }

  async leaveRoom (reason) {
    try {
      await this.voiceChannel.leave()

      this.inRoom = false
      this.voiceChannel = null
      this.textChannel = null
      this.connection = null
      this.dispatcher = null
      this.info = null
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async joinRoom (message) {
    try {
      const { channels } = message.member.guild
      const voiceChannel = channels.get(message.member.voiceChannelID)
      const textChannel = message.channel

      const connection = await voiceChannel.join()

      this.inRoom = true
      this.voiceChannel = voiceChannel
      this.textChannel = message.channel
      this.connection = connection
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async playTrack (url, message) {
    if (!this.inRoom && message) await this.joinRoom(message)

    const stream = ytdl(url, { filter : 'audioonly' })
    const dispatcher = this.connection.playStream(stream, this.streamOptions)

    this.dispatcher = dispatcher

    stream.on('info', info => {
      this.info = info
      this.nowPlaying()
    })

    stream.on('error', err => console.log(err))

    dispatcher.on('end', this.onTrackEnd)
  }

  async changeTrack (url) {
    const currentVolume = this.dispatcher.volume
    this.dispatcher.end('change')

    this.dispatcher = null
    this.info = null

    // Timeout fixes upstream issue
    // https://github.com/hydrabolt/discord.js/issues/1387
    setTimeout(async () => {
      await this.playTrack(url)
    }, 50)
  }

  async stopTrack () {
    this.dispatcher.end('stop')
    await this.leaveRoom()
  }

  async pauseTrack () {
    this.dispatcher.pause()
    this.textChannel.send(':pause_button: Sound paused, use `!resume` or `!play` to resume playback')
  }

  async resumeTrack () {
    this.dispatcher.resume()
    this.textChannel.send(':notes: Playback resumed')
  }

  async getVolume (message) {
    const response = `:speaker: ${this.dispatcher.volume * 100}`
    message.channel.send(response)
  }

  // volume is given as 0 - 100
  async setVolume (volume, message) {
    const prev = this.dispatcher.volume * 100
    const emoji = volume > prev ? ':arrow_heading_up:' : ':arrow_heading_down:'

    this.dispatcher.setVolume(volume / 100)
    this.streamOptions.volume = volume / 100
    this.textChannel.send(`:speaker: ${prev} ${emoji} ${volume}`)
  }

  async queueAdd (url, message) {
    try {
      const info = await ytdl.getInfo(url)
      this.queue.add(info)
      message.channel.send(`:radio: Queued - ${info.title}`)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async queueList (message) {
    if (this.queue.isEmpty()) {
      return message.channel.send(`Nothing is queued`)
    }

    return message.channel.send(this.queue.list())
  }

  async queueRemove (index, message) {
    if (this.queue.isEmpty()) {
      return message.channel.send(`Nothing is queued`)
    }

    const removed = this.queue.remove(index)
    return message.channel.send(`Removed - ${removed.title}`)
  }

  async queueClear (message) {
    this.queue = new Queue()
    return message.channel.send('Queue cleared')
  }

  async skipTrack (message) {
    if (this.queue.isEmpty()) {
      return message.channel.send(`Nothing is queued`)
    }

    const next = this.queue.next()
    await this.changeTrack(next.url)
  }
}

module.exports = Player
