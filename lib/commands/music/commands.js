const Players = require('./Players')

module.exports = async (message) => {
  if (/^!play (\S+)$/i.test(message.content)) {
    // Play track
    // If playing queue track

    const url = message.content.match(/^!play (\S+)$/i)[1]

    try {
      const { channels, id } = message.member.guild
      const voiceChannel = channels.get(message.member.voiceChannelID)
      const textChannel = message.channel

      const player = Players.getPlayer(id)
      await player.joinRoom(voiceChannel, textChannel)
      await player.playTrack(url)
    } catch (err) {
      console.error(err)
      message.channel.send(`Couldn't play that track. :confounded:`)
    }

    return true
  }

  if (/^!change (\S+)$/i.test(message.content)) {
    // immediately change playing track

    const url = message.content.match(/^!change (\S+)$/i)[1]

    try {
      const { channels, id } = message.member.guild
      // const voiceChannel = channels.get(message.member.voiceChannelID)
      // const textChannel = message.channel

      const player = Players.getPlayer(id)
      // await player.joinRoom(voiceChannel, textChannel)
      await player.changeTrack(url)
    } catch (err) {
      console.error(err)
      message.channel.send(`Couldn't play that track. :confounded:`)
    }

    return true
  }

  if (message.content === '!pause' || message.content === '!play') {
    // pause track

    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.pauseTrack()

    return true
  }

  if (message.content === '!resume') {
    // unpause track

    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.resumeTrack()

    return true
  }

  if (message.content === '!stop') {
    // stop playing and drop queue

    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.stopTrack()

    return true
  }

  if (message.content === '!playing' || message.content === '!track' || message.content === '!shazam') {
    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    player.nowPlaying(message)
    return true
  }

  if (message.content === '!volume') {
    // get volume level

    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.getVolume(message)

    return true
  }

  if (/^!volume (\d{1,2}(?!\d)|100)$/i.test(message.content)) {
    // set volume level

    const volume = message.content.match(/^!volume (\d{1,2}(?!\d)|100)$/i)[1]

    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.setVolume(volume, message)

    return true
  }

  if (message.content === '!q') {}

  if (message.content === '!ql') {}

  if (message.content === '!qr') {}

  if (message.content === '!qc') {}

  if (message.content === '!skip' || message.content === '!next') {}

  return false
}
