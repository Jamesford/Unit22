const Discord = require('discord.js')

module.exports = (message, client, commands) => {
  let embed = new Discord.RichEmbed()

  embed.setDescription('Available Plugin Commands')

  commands
    .filter(command => command.usageText && command.defineText)
    .forEach(command => {
      embed.addField(command.usageText, `:small_blue_diamond: ${command.defineText}`)
    })

  embed.setFooter(client.user.username, client.user.avatarURL)

  return message.channel.send('', {embed})
}
