const Discord = require('discord.js')

module.exports = (message, client) => {
  let embed = new Discord.RichEmbed()

  embed.setDescription('Available Commands')

  embed.addField('`!help`', ':small_blue_diamond: display this help message')

  embed.addField(
    '`!plugins`',
    ':small_blue_diamond: display plugin commands & information'
  )

  // embed.addField('`!ping`', ':small_blue_diamond: responds with pong')

  // embed.addField('`!where`', ':small_blue_diamond: responds with the name of your current voice channel')

  embed.setFooter(client.user.username, client.user.avatarURL)

  return message.channel.send('', { embed })
}
