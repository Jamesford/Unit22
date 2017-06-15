// Example Plugin
// Echos text back in the same channel
module.exports = (bot, config, client) => {
  bot.command(/^!echo (.*)$/i, (message, match) => {
    const echo = match[1]
    return message.channel.send(echo)
  })
  .usage('!echo <text to echo>')
  .define('responds with whatever you type after !echo')

  bot.command(/^!plugin example$/i, message => {
    return message.channel.send(`\`\`\`js
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
    \`\`\``)
  })
  .usage('!plugin example')
  .define('responds with the code for the echo plugin')
}
