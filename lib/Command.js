class Command {
  constructor(config) {
    this.regex = config.regex
    this.usage = config.usage
    this.description = config.description
    this.func = config.func
  }
}

module.exports = Command
