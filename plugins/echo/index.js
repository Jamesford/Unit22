// Example Plugin
// Echos text back in the same channel
module.exports = (bot, config, client) => {
  bot.command({
    regex: /^!echo (.*)$/i,
    usage: '!echo <text to echo>',
    description: 'responds with whatever you type after !echo',
    function: (message, match) => {
      const echo = match[1]
      return message.channel.send(echo)
    }
  })


  bot.command({
    regex: /^!plugin example$/i,
    usage: '!plugin example',
    description: 'responds with the code for the echo plugin',
    function: message => {
      return message.channel.send(`\`\`\`js
// Example Plugin
// Echos text back in the same channel
module.exports = (bot, config, client) => {
  bot.command({
    regex: /^!echo (.*)$/i,
    usage: '!echo <text to echo>',
    description: 'responds with whatever you type after !echo',
    function: (message, match) => {
      const echo = match[1]
      return message.channel.send(echo)
    }
  })
}
\`\`\``)
    }
  })
}
