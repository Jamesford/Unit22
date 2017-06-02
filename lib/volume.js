const Instances = require('./instances')

module.exports = (message, volume) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance || !instance.dispatcher) return message.channel.send('There\'s nothing playing')

  // Update volume
  instance.dispatcher.setVolume(volume)
}
