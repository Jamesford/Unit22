const ytdl = require('ytdl-core')
const Instances = require('./instances')
const streamOptions = { seek: 0, volume: 1 }

module.exports = (message, video) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { channels, id } = message.member.guild
  const voiceChannel = channels.get(usersVoiceChannelID)
  voiceChannel.join()
    .then(connection => {
      const stream = ytdl(video, { filter : 'audioonly' })
      const dispatcher = connection.playStream(stream, streamOptions)

      // Keep a hold of this stuff
      Instances.create(id, { voiceChannel, connection, dispatcher })

      stream.on('info', info => {
        message.channel.send(`Now Playing - ${info.title}`)
      })

      dispatcher.on('end', () => {
        voiceChannel.leave()
      })
    })
    .catch(err => {
      message.channel.send('I can\'t play that video :confounded:')
      console.error(err)
    })
}
