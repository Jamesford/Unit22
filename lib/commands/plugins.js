const Discord = require('discord.js')

module.exports = (message, client, commands) => {
  let embed = new Discord.RichEmbed()

  embed.setDescription('Available Plugin Commands')

  commands
    .filter(command => command.usage && command.description)
    .forEach(command => {
      embed.addField('`' + command.usage + '`', `:small_blue_diamond: ${command.description}`)
    })

  embed.setFooter(client.user.username, client.user.avatarURL)

  return message.channel.send('', {embed})
}
