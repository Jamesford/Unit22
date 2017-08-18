const Command = require('./Command')

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

module.exports = Bot
