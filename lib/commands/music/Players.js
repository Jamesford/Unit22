const ytdl = require('ytdl-core')
const streamOptions = { seek: 0, volume: 1, passes: 1 }

class Player {
  constructor (id) {
    // Set on creation
    this.id = id

    // Set when channel is joined
    this.voiceChannel = null
    this.textChannel = null
    this.connection = null

    // Set when stream begins
    this.dispatcher = null
    this.info = null

    // The queue
    this.queue = []

    this.sendNowPlaying = this.sendNowPlaying.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.playTrack = this.playTrack.bind(this)
  }

  sendNowPlaying () {
    this.textChannel.send(`:musical_note: Now Playing - ${this.info.title}`)
  }

  async leaveRoom (reason) {
    // Reasons that prevent leaveRoom from firing
    if (['change'].includes(reason)) return null

    try {
      await this.voiceChannel.leave()

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

  async joinRoom (voiceChannel, textChannel) {
    try {
      const connection = await voiceChannel.join()

      this.voiceChannel = voiceChannel
      this.connection = connection
      this.textChannel = textChannel
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async playTrack (url) {
    const stream = ytdl(url, { filter : 'audioonly' })
    const dispatcher = this.connection.playStream(stream, streamOptions)

    this.dispatcher = dispatcher

    stream.on('info', info => {
      this.info = info
      this.sendNowPlaying()
    })

    dispatcher.on('end', this.leaveRoom)
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
}

class Players {
  constructor () {
    this.players = new Map()
  }

  getPlayer (id) {
    if (this.players.has(id)) {
      return this.players.get(id)
    } else {
      const player = new Player(id)
      this.players.set(id, player)
      return player
    }
  }
}

module.exports = new Players()