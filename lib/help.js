const Discord = require('discord.js')

module.exports = (message, client) => {
  let embed = new Discord.RichEmbed()

  embed.setDescription('Available Commands')

  embed.addField('!help', ':small_blue_diamond: display this help message')

  embed.addField('!ping', ':small_blue_diamond: responds with pong')

  embed.addField('!where', ':small_blue_diamond: responds with the name of your current voice channel')

  embed.addField('!play <youtube url>', ':small_blue_diamond: plays the youtube video\'s sound in your current voice channel')

  embed.addField('!stop', ':small_blue_diamond: stops playing any sound and disconnects from the voice channel')

  embed.addField('!volume', ':small_blue_diamond: responds with the current volume level')

  embed.addField('!volume <1-10>', ':small_blue_diamond: changes the current volume level')

  embed.setFooter(client.user.username, client.user.avatarURL)

  return message.channel.send('', {embed})
}
