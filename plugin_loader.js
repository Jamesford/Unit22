const { promisify } = require('util')
const { readdir } = require('fs')
const readDirAsync = promisify(readdir)

class Command {
  constructor (regex, func) {
    this.regex = regex
    this.func = func
    this.usageText = ''
    this.defineText = ''
  }

  usage (text) {
    this.usageText = text
    return this
  }

  define (text) {
    this.defineText = text
    return this
  }
}

class Bot {
  constructor () {
    this._commands = []
  }

  command (regex, func) {
    const command = new Command(regex, func)
    this._commands.push(command)
    return command
  }
}

module.exports = async (config, client) => {
  let plugin_files
  try {
    plugin_files = await readDirAsync('./plugins')
  } catch (error) {
    throw error
  }

  const bot = new Bot

  plugin_files
    .forEach(file => {
      const plugin = require(`./plugins/${file}`)
      plugin(bot, config, client)
    })

  return bot
}
