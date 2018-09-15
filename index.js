const Discord = require('discord.js')
const config = require('./config.json')
const initialise = require('./lib/initialise')

// Commands
const help = require('./lib/commands/help')
const plugins = require('./lib/commands/plugins')
const musicCommands = require('./lib/commands/music')

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
    // Check if message is a command, if not ignore it
    if (message.content[0] !== '!') return null

    console.log(`Command: ${message.content}`)

    const executedFunction = await musicCommands(message)
    // Do not execute other commands if music command was executed
    if (executedFunction) return null

    if (message.content === '!help') {
      return help(message, client)
    }

    if (message.content === '!plugins') {
      return plugins(message, client, bot._commands)
    }

    if (message.content === '!ping') {
      return message.channel.send('pong :ping_pong:')
    }

    // Test plugin commands & execute if match
    bot._commands.forEach(command => {
      // If messaage content matches regex
      if (command.regex.test(message.content)) {
        // Get match values
        const match = message.content.match(command.regex)
        // Execute command
        command.function(message, match)
      }
    })
  })

  // Conenct/Login
  client.login(config.bot_token)
})
.catch(error => {
  throw error
})
