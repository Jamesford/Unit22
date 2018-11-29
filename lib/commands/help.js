const Discord = require('discord.js')

module.exports = bot => {
  bot.command({
    regex: /^!help$/i,
    usage: '!help',
    description: 'display this help message',
    func: async (bot, message, match) => {
      let embed = new Discord.RichEmbed()

      embed.setDescription('Available Commands')

      bot._commands.forEach(({ usage, description }) => {
        if (usage && description) {
          embed.addField(`\`${usage}\``, `:small_blue_diamond: ${description}`)
        }
      })

      embed.setFooter(bot.username(), bot.avatar())

      return message.channel.send('', { embed })
    }
  })

  bot.command({
    regex: /^!(help plugins|plugins)$/i,
    usage: '!help plugins | !plugins',
    description: 'list installed plugins',
    func: async (bot, message, match) => {
      let embed = new Discord.RichEmbed()

      embed.setDescription('Installed Plugins')

      embed.setFooter(bot.username(), bot.avatar())

      return message.channel.send('', { embed })
    }
  })
}
