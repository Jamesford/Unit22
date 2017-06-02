const Instances = require('./instances')

module.exports = (message) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance) return message.channel.send('There\'s nothing to stop')

  // Stop / Close all connections
  if (instance.dispatcher) instance.dispatcher.end()
  if (instance.connection) instance.connection.disconnect()
  if (instance.voiceChannel) instance.voiceChannel.leave()

  // Remove references from memory
  Instances.delete(id)
}
