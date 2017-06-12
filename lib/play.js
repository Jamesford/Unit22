const ytdl = require('ytdl-core')
const Instances = require('./instances')
const streamOptions = { seek: 0, volume: 1 }

module.exports = (message, video) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { channels, id } = message.member.guild

  const instance = Instances.get(id)

  if (!instance) {
    const voiceChannel = channels.get(usersVoiceChannelID)
    voiceChannel.join()
      .then(connection => {
        const stream = ytdl(video, { filter : 'audioonly' })
        const dispatcher = connection.playStream(stream, streamOptions)

        stream.on('info', info => {
          message.channel.send(`Now Playing - ${info.title}`)
        })

        let cancel = dispatcher.on('end', reason => {
          console.log('reason:', reason)
          if (reason !== 'switch') voiceChannel.leave()
        })

        console.log('cancel:', cancel)

        // Keep a hold of this stuff
        Instances.create(id, { voiceChannel, connection, dispatcher })
      })
      .catch(err => {
        message.channel.send('I can\'t play that video :confounded:')
        console.error(err)
      })
  } else if (instance && instance.voiceChannel.id !== usersVoiceChannelID) {
    // Move Channel, Change track
    instance.dispatcher.end()
    const voiceChannel = channels.get(usersVoiceChannelID)
    voiceChannel.join()
      .then(connection => {
        const stream = ytdl(video, { filter : 'audioonly' })
        const dispatcher = connection.playStream(stream, streamOptions)

        stream.on('info', info => {
          message.channel.send(`Now Playing - ${info.title}`)
        })

        dispatcher.on('end', reason => {
          console.log('reason:', reason)
          if (reason !== 'switch') voiceChannel.leave()
        })

        // Keep a hold of this stuff
        Instances.update(id, { voiceChannel, connection, dispatcher })
      })
      .catch(err => {
        message.channel.send('I can\'t play that video :confounded:')
        console.error(err)
      })
  } else {
    // Just change track
    const volume = instance.dispatcher.volume
    const stream = ytdl(video, { filter: 'audioonly' })
    const dispatcher = instance.connection.playStream(stream, { seek: 0, volume: volume })
    stream.on('info', info => {
      message.channel.send(`Now Playing - ${info.title}`)
    })

    dispatcher.on('end', reason => {
      if (reason !== 'switch') instance.voiceChannel.leave()
    })

    instance.dispatcher.end('switch')
    Instances.update(id, { dispatcher })
  }
}
