const Command = require('./Command')

class Bot {
  constructor () {
    this._commands = []
  }

  command (config) {
    const command = new Command(config)
    this._commands.push(command)
    return this
  }
}

module.exports = Bot
