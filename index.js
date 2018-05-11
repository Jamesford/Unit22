const Discord = require('discord.js')
const config = require('./config.json')
const initialise = require('./lib/initialise')

// Built-ins
const help = require('./lib/commands/help')
const plugins = require('./lib/commands/plugins')

// Old music modules
// const playMusic = require('./lib/commands/play')
// const volumeCtrl = require('./lib/commands/volume')
// const playbackCtrl = require('./lib/commands/playback')
// const queueCtrl = require('./lib/commands/queue')

const musicCommands = require('./lib/commands/music/commands')

// Setup
const client = new Discord.Client()

initialise(config, client)
.then(bot => {
  // Bot is running
  client.on('ready', () => {
    console.log('Unit22 Online')
    client.user.setActivity('!help for commands')
  })

  // Listen for messages
  client.on('message', async (message) => {
    if (message.content[0] !== '!') return false

    console.log(`Command: ${message.content}`)

    const executedFunction = await musicCommands(message)
    // Do not execute other commands if music command was executed
    if (executedFunction) return false

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
