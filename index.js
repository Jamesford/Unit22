const Discord = require('discord.js')
const config = require('./config.json')
const initialise = require('./lib/initialise')

// Built-ins
const help = require('./lib/commands/help')
const plugins = require('./lib/commands/plugins')
const playMusic = require('./lib/commands/play')
const volumeCtrl = require('./lib/commands/volume')
const playbackCtrl = require('./lib/commands/playback')
const queueCtrl = require('./lib/commands/queue')

const Players = require('./lib/commands/music/Players')

// Setup
const client = new Discord.Client()

initialise(config, client)
.then(bot => {
  // Bot is running
  client.on('ready', () => {
    console.log('Unit22 Online')
    client.user.setGame('!help for commands')
  })

  // Listen for messages
  client.on('message', async (message) => {
    if (/^!test (\S+)$/i.test(message.content)) {
      const url = message.content.match(/^!test (\S+)$/i)[1]

      try {
        const { channels, id } = message.member.guild
        const voiceChannel = channels.get(message.member.voiceChannelID)
        const textChannel = message.channel

        const player = Players.getPlayer(id)
        await player.joinRoom(voiceChannel, textChannel)
        await player.playTrack(url)
      } catch (err) {
        console.error(err)
        return message.channel.send(`Couldn't play that track. :confounded:`)
      }
    }

    if (/^!change (\S+)$/i.test(message.content)) {
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
        return message.channel.send(`Couldn't play that track. :confounded:`)
      }
    }

    if (message.content === '!help') {
      return help(message, client)
    }

    if (message.content === '!plugins') {
      return plugins(message, client, bot._commands)
    }

    if (message.content === '!ping') {
      return message.channel.send('pong :ping_pong:')
    }

    if (message.content === '!where') {
      const usersVoiceChannelID = message.member.voiceChannelID

      // Not in voice
      if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')

      // Tell 'em
      const usersVoiceChannel = message.member.guild.channels.get(usersVoiceChannelID)
      return message.channel.send(`You're in ${usersVoiceChannel.name} on ${message.member.guild.name}`)
    }

    if (message.content === '!pause') {
      return playbackCtrl.pause(message)
    }

    if (message.content === '!resume' || message.content === '!play') {
      return playbackCtrl.resume(message)
    }

    if (message.content === '!stop') {
      return playbackCtrl.stop(message)
    }

    if (/^!play (\S+)$/i.test(message.content)) {
      const url = message.content.match(/^!play (\S+)$/i)[1]
      return playMusic(message, url)
    }

    if (/^!volume( (\d|10))?$/i.test(message.content)) {
      const integer = message.content.match(/^!volume( (\d|10))?$/i)[1]

      if (integer === undefined) {
        return volumeCtrl.get(message)
      } else {
        const volume = integer / 10
        return volumeCtrl.set(message, volume)
      }
    }

    if (message.content === '!queue list' || message.content === '!q list') {
      return queueCtrl.list(message)
    }

    if (/^!(queue|q) remove (\d+)$/i.test(message.content)) {
      const int = parseInt(message.content.match(/^!(queue|q) remove (\d+)$/i)[2])
      return queueCtrl.remove(message, int)
    }

    if (/^!(queue|q) (\S+)$/i.test(message.content)) {
      const url = message.content.match(/^!(queue|q) (\S+)$/i)[2]
      return queueCtrl.add(message, url)
    }


    // Test plugin commands & execute if match
    bot._commands.forEach(command => {
      // If messaage content matches regex
      if (command.regex.test(message.content)) {
        // Get match values
        const match = message.content.match(command.regex)
        // Execute command
        command.func(message, match)
      }
    })
  })

  // Conenct/Login
  client.login(config.bot_token)
})
.catch(error => {
  throw error
})
