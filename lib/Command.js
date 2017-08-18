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

module.exports = Command
