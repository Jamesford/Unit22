module.exports = (bot, config, client) => {
  bot.command(/^!(ow|overwatch) ([^0-9\s](\S{2,11})#(\d{4}))( (eu|us|kr))?$/i, (message, match) => {
      const battletag = match[2]
      const region = match[6]
      message.channel.send(`retreive info for ${battletag} on ${region || 'any'} servers`)
    })
    .usage('!ow <battletag> [region (us, eu, kr)]')
    .define(`displays player statistics for the given battletag`)
}
