const Players = require('./Players')

module.exports = (bot, config, client) => {
  bot.command({
    regex: /^!play (\S+)$/i,
    usage: '!play <youtube url>',
    description:
      'plays or queues the youtube url in your current voice channel',
    function: async (message, match) => {
      try {
        const url = match[1]
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
    }
  })

  bot.command({
    regex: /^!change (\S+)$/i,
    usage: '!change <youtube url>',
    description: 'immediately changes to play the new youtube url',
    function: async (message, match) => {
      try {
        const url = match[1]
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
    }
  })

  bot.command({
    regex: /^!pause$/i,
    usage: '!pause',
    description: 'pauses the track currently being played',
    function: async message => {
      try {
        const { channels, id } = message.member.guild
        const player = Players.getPlayer(id)
        await player.pauseTrack()
      } catch (err) {
        console.error(err)
        message.channel.send(`Couldn't pause. :confounded:`)
      }
    }
  })

  bot.command({
    regex: /^!(resume|play)$/i,
    usage: '!resume | !play',
    description: 'resumes the paused track',
    function: async (message, match) => {
      try {
        const { channels, id } = message.member.guild
        const player = Players.getPlayer(id)
        await player.resumeTrack()
      } catch (err) {
        console.error(err)
        message.channel.send(`Couldn't resume. :confounded:`)
      }
    }
  })

  bot.command({
    regex: /^!stop$/i,
    usage: '!stop',
    description:
      'stops playing any sound and disconnects from the voice channel',
    function: async (message, match) => {
      try {
        // stop playing and drop queue
        const { channels, id } = message.member.guild
        const player = Players.getPlayer(id)
        await player.stopTrack()
      } catch (err) {
        console.error(err)
        message.channel.send(`Couldn't stop. :confounded:`)
      }
    }
  })

  bot.command({
    regex: /^!(playing|track|shazam)$/i,
    usage: '!playing | !track | !shazam',
    description: 'responds with the currently playing track',
    function: async (message, match) => {
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      player.nowPlaying(message)
    }
  })

  bot.command({
    regex: /^!volume$/i,
    usage: '!volume',
    description: 'responds with the current volume level',
    function: async (message, match) => {
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.getVolume(message)
    }
  })

  bot.command({
    regex: /^!volume (\d{1,2}(?!\d)|100)$/i,
    usage: '!volume <0-100>',
    description: 'changes the current volume level',
    function: async (message, match) => {
      const volume = match[1]
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.setVolume(volume, message)
    }
  })

  bot.command({
    regex: /^!(queue|q) (\S+)$/i,
    usage: '!queue <youtube url> | !q <youtube url>',
    description: 'adds a youtube url to the queue',
    function: async (message, match) => {
      const url = match[2]
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.queueAdd(url, message)
    }
  })

  bot.command({
    regex: /^!(queue list|ql)$/i,
    usage: '!queue list | !ql',
    description: 'responds with the current queue',
    function: async (message, match) => {
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.queueList(message)
    }
  })

  bot.command({
    regex: /^!(queue|q) remove (\d+)$/i,
    usage: '!queue remove <index> | !q remove <index>',
    description: 'removes a queue entry based on its index',
    function: async (message, match) => {
      const index = match[2]
      const int = parseInt(index)
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.queueRemove(int, message)
    }
  })

  bot.command({
    regex: /^!(queue clear|qc)$/i,
    usage: '!queue clear | !qc',
    description: 'clears the current queue',
    function: async (message, match) => {
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.queueClear(message)
    }
  })

  bot.command({
    regex: /^!(skip|next)$/i,
    usage: '!skip | !next',
    description: 'skips to the next item in the queue',
    function: async (message, match) => {
      const { channels, id } = message.member.guild
      const player = Players.getPlayer(id)
      await player.skipTrack(message)
    }
  })
}
