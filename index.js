const Discord = require('discord.js')
const config = require('./config.json')
const playMusic = require('./lib/play')
const stopMusic = require('./lib/stop')
const changeVolume = require('./lib/volume')

// Setup
const client = new Discord.Client()

// Bot is running
client.on('ready', () => {
  console.log('Unit22 Online')
})

// Listen for messages
client.on('message', message => {
  if (message.content === '!ping') {
    message.channel.send('pong :ping_pong:')
  }

  if (message.content === '!log') {
    console.log(message)
  }

  if (message.content === '!where') {
    const usersVoiceChannelID = message.member.voiceChannelID
    
    // Not in voice
    if (!usersVoiceChannelID) return message.channel.send('Looks like you aren\'t in a voice channel :exclamation:')
    
    // Tell 'em
    const usersVoiceChannel = message.member.guild.channels.get(usersVoiceChannelID)
    return message.channel.send(`You're in ${usersVoiceChannel.name} on ${message.member.guild.name}`)
  }

  if (message.content === '!stop') {
    stopMusic(message)
  }

  if (/^!play (\S+)$/i.test(message.content)) {
    const url = message.content.match(/^!play (\S+)$/i)[1]
    playMusic(message, url)
  }

  if (/^!volume (\d|10)$/i.test(message.content)) {
    const volume = message.content.match(/^!volume (\d|10)$/i)[1] / 10
    changeVolume(message, volume)
  }
})

// Conenct/Login
client.login(config.bot_token)
