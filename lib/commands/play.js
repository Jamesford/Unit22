const ytdl = require('ytdl-core')
const Instances = require('./instances')
const streamOptions = { seek: 0, volume: 1, passes: 1 }
const { Queues } = require('./queue')

function delayedLeave (instanceId, voiceChannel, reason) {
  // Force stop leaves channel immediately, don't need to trigger this
  if (reason !== 'forceStop') {

    const Queue = Queues[instanceId]
    if (Queue && !Queue.empty()) {
      const video = Queue.next()
      const instance = Instances.get(instanceId)

      const currentVolume = instance.dispatcher.volume
      instance.dispatcher.end()

      const stream = ytdl(video.url, { filter: 'audioonly' })
      const dispatcher = instance.voiceChannel.connection.playStream(stream, Object.assign({}, streamOptions, { volume: currentVolume }))

      // stream.on('info', info => {
      //   message.channel.send(`:musical_note: Now Playing - ${info.title}`)
      // })

      dispatcher.on('end', delayedLeave.bind(this, instanceId, instance.voiceChannel))

      Instances.update(instanceId, { dispatcher })
    } else {
      // Seconds after to check if still speaking
      const delay = 5

      setTimeout(() => {
        // If connected to voice
        if (voiceChannel.connection) {
          // And not "speaking"
          if (!voiceChannel.connection.speaking) {
            // Leave the voice channel
            voiceChannel.leave()
            // Clear instance
            Instances.delete(instanceId)
          }
        }
      }, delay * 1000)
    }
  }
}

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
          message.channel.send(`:musical_note: Now Playing - ${info.title}`)
        })

        dispatcher.on('end', delayedLeave.bind(this, id, voiceChannel))

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
    instance.connection.disconnect()
    instance.voiceChannel.leave()

    const voiceChannel = channels.get(usersVoiceChannelID)
    voiceChannel.join()
      .then(connection => {
        const stream = ytdl(video, { filter : 'audioonly' })
        const dispatcher = connection.playStream(stream, streamOptions)

        stream.on('info', info => {
          message.channel.send(`:musical_note: Now Playing - ${info.title}`)
        })

        dispatcher.on('end', delayedLeave.bind(this, id, voiceChannel))

        // Keep a hold of this stuff
        Instances.update(id, { voiceChannel, connection, dispatcher })
      })
      .catch(err => {
        message.channel.send('I can\'t play that video :confounded:')
        console.error(err)
      })
  } else {
    // Just change track
    const currentVolume = instance.dispatcher.volume
    instance.dispatcher.end()

    setTimeout(() => {
      const stream = ytdl(video, { filter: 'audioonly' })
      const dispatcher = instance.voiceChannel.connection.playStream(stream, Object.assign({}, streamOptions, { volume: currentVolume }))

      stream.on('info', info => {
        message.channel.send(`:musical_note: Now Playing - ${info.title}`)
      })

      dispatcher.on('end', delayedLeave.bind(this, id, instance.voiceChannel))

      Instances.update(id, { dispatcher })
    }, 50) // Needs a short delay to work, discord.js issue seemingly
  }
}