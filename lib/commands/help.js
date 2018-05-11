const Discord = require('discord.js')

module.exports = (message, client) => {
  let embed = new Discord.RichEmbed()

  embed.setDescription('Available Commands')

  embed.addField('`!help`', ':small_blue_diamond: display this help message')

  embed.addField('`!plugins`', ':small_blue_diamond: display plugin commands & information')

  // embed.addField('`!ping`', ':small_blue_diamond: responds with pong')

  // embed.addField('`!where`', ':small_blue_diamond: responds with the name of your current voice channel')

  embed.addField('`!play <youtube url>`', ':small_blue_diamond: plays or queues the youtube url in your current voice channel')

  embed.addField('`!change <youtube url>`', ':small_blue_diamond: immediately changes to play the new youtube url')

  embed.addField('`!pause`', ':small_blue_diamond: pauses the track currently being played')

  embed.addField('`!resume | !play`', ':small_blue_diamond: resumes the paused track')

  embed.addField('`!stop`', ':small_blue_diamond: stops playing any sound and disconnects from the voice channel')

  embed.addField('`!playing | !track | !shazam`', ':small_blue_diamond: responds with the currently playing track')

  embed.addField('`!volume`', ':small_blue_diamond: responds with the current volume level')

  embed.addField('`!volume <0-100>`', ':small_blue_diamond: changes the current volume level')

  embed.setFooter(client.user.username, client.user.avatarURL)

  return message.channel.send('', {embed})
}
