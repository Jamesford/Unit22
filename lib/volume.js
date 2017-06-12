const Instances = require('./instances')

exports.set = (message, volume) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance || !instance.dispatcher) return message.channel.send('There\'s nothing playing')

  // Previous volume & get emoji based on change
  const prev = instance.dispatcher.volume
  const emoji = volume > prev ? ':arrow_heading_up:' : ':arrow_heading_down:'

  // Update volume
  instance.dispatcher.setVolume(volume)

  // Message change info
  return message.channel.send(`:speaker: ${prev * 10} ${emoji} ${volume * 10}`)
}

exports.get = (message) => {
  const usersVoiceChannelID = message.member.voiceChannelID

  // Not in voice
  if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

  const { id } = message.member.guild

  // Get channel, connection & dispatcher
  const instance = Instances.get(id)
  if (!instance || !instance.dispatcher) return message.channel.send('There\'s nothing playing')

  return message.channel.send(`:speaker: ${instance.dispatcher.volume * 10}`)
}
