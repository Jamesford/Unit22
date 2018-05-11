const Players = require('./Players')

module.exports = async (message) => {
  if (/^!play (\S+)$/i.test(message.content)) {
    try {
      const url = message.content.match(/^!play (\S+)$/i)[1]
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)

      if (player.inRoom) {
        await player.queueAdd(url, message)
      } else {
        await player.playTrack(url, message)
      }
    } catch (err) {
      console.error(err)
      message.channel.send(`Couldn't play that track. :confounded:`)
    }

    return true
  }

  if (/^!change (\S+)$/i.test(message.content)) {
    try {
      const url = message.content.match(/^!change (\S+)$/i)[1]
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)

      if (player.inRoom) {
        await player.changeTrack(url)
      } else {
        await player.playTrack(url, message)
      }
    } catch (err) {
      console.error(err)
      message.channel.send(`Couldn't play that track. :confounded:`)
    }

    return true
  }

  if (message.content === '!pause') {
    // pause track

    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.pauseTrack()

    return true
  }

  if (message.content === '!resume' || message.content === '!play') {
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

  if (/^!(queue|q) (\S+)$/i.test(message.content)) {
    const url = message.content.match(/^!(queue|q) (\S+)$/i)[2]
    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.queueAdd(url, message)

    return true
  }

  if (message.content === '!queue list' || message.content === '!ql') {
    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.queueList(message)

    return true
  }

  if (/^!(queue|q) remove (\d+)$/i.test(message.content)) {
    const match = message.content.match(/^!(queue|q) remove (\d+)$/i)[2]
    const int = parseInt(match)
    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.queueRemove(int, message)

    return true
  }

  if (message.content === '!queue clear' || message.content === '!qc') {
    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.queueClear(message)

    return true
  }

  if (message.content === '!skip' || message.content === '!next') {
    const { channels, id } = message.member.guild
    const player = Players.getPlayer(id)
    await player.skipTrack(message)

    return true
  }

  return false
}
