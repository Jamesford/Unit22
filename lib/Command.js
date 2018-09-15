class Command {
  constructor (config) {
    this.regex = config.regex
    this.usage = config.usage
    this.description = config.description
    this.function = config.function
  }
}

module.exports = Command
