// Example Plugin
// Echos text back in the same channel
module.exports = (bot, config, client) => {
  bot.command(/^!echo (.*)$/i, (message, match) => {
    const echo = match[1]
    return message.channel.send(echo)
  })
  .usage('!echo <text to echo>')
  .define('responds with whatever you type after !echo')
}
