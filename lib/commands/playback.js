const Instances = require('./instances')

exports.pause = (message) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance) return message.channel.send('There\'s nothing to pause')
  if (instance.dispatcher && instance.dispatcher.paused) return message.channel.send('It\'s already paused!')
  
  instance.dispatcher.pause()
  return message.channel.send(':pause_button: Sound paused, use `!resume` or `!play` to resume playback')
}

exports.resume = (message) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance) return message.channel.send('There\'s nothing to resume')
  if (instance.dispatcher && !instance.dispatcher.paused) return message.channel.send('It\'s already playing!')

  instance.dispatcher.resume()
  return message.channel.send(':notes: Playback resumed')
}

exports.stop = (message) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance) return message.channel.send('There\'s nothing to stop')

  // Stop / Close all connections
  if (instance.dispatcher) instance.dispatcher.end('forceStop')
  if (instance.connection) instance.connection.disconnect()
  if (instance.voiceChannel) instance.voiceChannel.leave()

  // Remove references from memory
  Instances.delete(id)
}

