const Discord = require('discord.js')
const config = require('./config.json')
const help = require('./lib/help')
const playMusic = require('./lib/play')
const volumeCtrl = require('./lib/volume')
const playbackCtrl = require('./lib/playback')

// Setup
const client = new Discord.Client()

// Bot is running
client.on('ready', () => {
  console.log('Unit22 Online')
  client.user.setGame('!help for commands')
})

// Listen for messages
client.on('message', message => {
  if (message.content === '!help') {
    help(message, client)
  }

  if (message.content === '!ping') {
    message.channel.send('pong :ping_pong:')
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
    playbackCtrl.pause(message)
  }

  if (message.content === '!resume' || message.content === '!play') {
    playbackCtrl.resume(message)
  }

  if (message.content === '!stop') {
    playbackCtrl.stop(message)
  }

  if (/^!play (\S+)$/i.test(message.content)) {
    const url = message.content.match(/^!play (\S+)$/i)[1]
    playMusic(message, url)
  }

  if (/^!volume( (\d|10))?$/i.test(message.content)) {
    const integer = message.content.match(/^!volume( (\d|10))?$/i)[1]

    if (integer === undefined) {
      volumeCtrl.get(message)
    } else {
      const volume = integer / 10
      volumeCtrl.set(message, volume)
    }
  }
})

// Conenct/Login
client.login(config.bot_token)
