const Discord = require('discord.js')
const Command = require('./Command')

const commands = require('./commands')

class Bot {
  constructor(config) {
    this._config = config
    this._commands = []
    this._plugins = []

    this.username = this.username.bind(this)
    this.avatar = this.avatar.bind(this)
    this.command = this.command.bind(this)
    this.loadPlugins = this.loadPlugins.bind(this)
    this.start = this.start.bind(this)
    this._onReady = this._onReady.bind(this)
    this._onMessage = this._onMessage.bind(this)

    this._discord = new Discord.Client()
    this._discord.on('ready', this._onReady)
    this._discord.on('message', this._onMessage)

    commands.forEach(command => command(this))
  }

  username() {
    return this._discord.user.username
  }

  avatar() {
    return this._discord.user.avatarURL
  }

  command(config) {
    const command = new Command(config)
    this._plugins.push(command)
    return this
  }

  async loadPlugins() {
    // await getPlugins
  }

  async start() {
    await this._discord.login(this._config.bot_token)
  }

  _defaultCommand(config) {
    const command = new Command(config)
    this._commands.push(command)
    return this
  }

  _onReady() {
    console.log(`Connected`)
    this._discord.user.setActivity('!help for commands')
  }

  async _onMessage(msg) {
    // Check if message is a command, if not ignore it
    if (msg.content[0] !== '!') return null

    console.log(`Command: ${msg.content}`)

    // Built-in Commands
    this._commands.forEach(command => {
      if (command.regex.test(msg.content)) {
        const match = msg.content.match(command.regex)
        command.func(this, msg, match)
      }
    })
  }
}

module.exports = Bot
