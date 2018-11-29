module.exports = bot => {
  bot.command({
    regex: /^!ping$/i,
    usage: '!ping',
    description: 'responds with pong',
    func: async (_, msg) => {
      return msg.channel.send('pong :ping_pong:')
    }
  })
}
