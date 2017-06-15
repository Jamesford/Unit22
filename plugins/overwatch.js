const Discord = require('discord.js')
const request = require('request')
const _ = require('lodash')

function getStats (battletag) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `https://owapi.net/api/v3/u/${battletag.replace('#', '-')}/stats`,
      headers: {
        'User-Agent': 'Unit22 Overwatch Plugin'
      }
    }
    return request(options, (err, _, body) => {
      if (err) return reject(err)
      return resolve(JSON.parse(body))
    })
  })
}

function statsFromMostPlayedRegion (stats) {
  const regions = [
    { region: 'eu', stats: stats.eu },
    { region: 'us', stats: stats.us },
    { region: 'kr', stats: stats.kr }
  ].filter(r => r.stats)

  if (regions.length < 1) return { error: 'No stats found for that battletag for any region' } // No playtime at all
  if (regions.length === 1) return regions[0]

  let highest = { time: 0, index: 0 }
  regions.forEach((region, i) => {
    let compTime = region.stats.stats.competitive.game_stats.time_played
    let quickTime = region.stats.stats.quickplay.game_stats.time_played
    let totalTime = compTime + quickTime
    if (highest.time < totalTime) {
      highest.time = totalTime
      highest.index = i
    }
  })

  return regions[highest.index]
}

function getRegionStats (battletag, givenRegion, allStats) {
  if (givenRegion && !allStats[givenRegion]) return { error: `No stats found for that battletag in the ${givenRegion} region` }
  if (givenRegion && allStats[givenRegion]) {
    return { region: givenRegion, stats: allStats[givenRegion].stats }
  }
  const { region, stats, error } = statsFromMostPlayedRegion(allStats)
  return { region, stats: stats.stats, error}
}

function getRankIcon (skillRating) {
  if (!skillRating) return null
  if (skillRating < 1500) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-1.png`
  if (skillRating < 2000) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-2.png`
  if (skillRating < 2500) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png`
  if (skillRating < 3000) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-4.png`
  if (skillRating < 3500) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-5.png`
  if (skillRating < 4000) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-6.png`
  if (skillRating >= 4000) return `https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-7.png`
  return null
}

module.exports = (bot, config, client) => {
  bot.command(/^!(ow|overwatch) ([^0-9\s](\S{2,11})#(\d{4,}))( (eu|us|kr))?$/i, async (message, match) => {
    const battletag = match[2]
    const givenRegion = match[6]

    let allStats
    try {
      allStats = await getStats(battletag)
    } catch (error) {
      console.error(error)
      return message.channel.send(`Couldn't get stats for that battletag`)
    }

    console.log(allStats)

    const { region, stats, error } = getRegionStats(battletag, givenRegion, allStats)
    if (error) return message.channel.send(error)

    console.log(region, stats)

    const c = stats.quickplay

    console.log(c)

    let embed = new Discord.RichEmbed()

    embed.setAuthor(battletag, getRankIcon(c.overall_stats.comprank) || c.overall_stats.avatar, `https://playoverwatch.com/en-gb/career/pc/${region}/${battletag.replace('#', '-')}`)

    embed.setDescription(`${c.overall_stats.games} competitive games played (${c.overall_stats.win_rate}% won) over ${c.game_stats.time_played} hours.`)

    embed.addField('Level', c.overall_stats.level + (c.overall_stats.prestige * 100), true)

    embed.addField('Skill Rating', c.overall_stats.comprank || 'Unranked', true)

    embed.addField('Most Played Hero', 'Unknown', true)

    embed.addField('Eliminations', `**Average**: ${c.average_stats.eliminations_avg} (${(c.average_stats.eliminations_avg / c.average_stats.deaths_avg).toFixed(2)} KD)\n**Most**: ${c.game_stats.eliminations_most_in_game}\n**Total**: ${c.game_stats.eliminations}`, true)

    embed.addField('Damage', `**Average**: ${c.average_stats.damage_done_avg}\n**Most**: ${c.game_stats.damage_done_most_in_game}\n**Total**: ${c.game_stats.damage_done}`, true)

    embed.addField('Healing', `**Average**: ${c.average_stats.healing_done_avg}\n**Most**: ${c.game_stats.healing_done_most_in_game}\n**Total**: ${c.game_stats.healing_done}`, true)

    embed.addField('Solo Kills', `**Average**: ${c.average_stats.solo_kills_avg}\n**Most**: ${c.game_stats.solo_kills_most_in_game}\n**Total**: ${c.game_stats.solo_kills}`, true)

    embed.addField('Final Blows', `**Average**: ${c.average_stats.final_blows_avg}\n**Most**: ${c.game_stats.final_blows_most_in_game}\n**Total**: ${c.game_stats.final_blows}`, true)

    embed.addField('Environmental', `**Kills**: ${c.game_stats.environmental_kills}\n**Deaths**: ${c.game_stats.environmental_deaths}`, true)

    embed.addField('Objective Kills', `**Average**: ${c.average_stats.objective_kills_avg}\n**Most**: ${c.game_stats.objective_kills_most_in_game}\n**Total**: ${c.game_stats.objective_kills}`, true)

    embed.addField('Offensive Assits', `**Average**: ${c.average_stats.offensive_assists_avg}\n**Most**: ${c.game_stats.offensive_assists_most_in_game}\n**Total**: ${c.game_stats.offensive_assists}`, true)

    embed.addField('Defensive Assists', `**Average**: ${c.average_stats.defensive_assists_avg}\n**Most**: ${c.game_stats.defensive_assists_most_in_game}\n**Total**: ${c.game_stats.defensive_assists}`, true)

    embed.addField('Objective Time', `**Average**: ${c.average_stats.objective_time_avg}\n**Most**: ${c.game_stats.objective_time_most_in_game}\n**Total**: ${c.game_stats.objective_time}`, true)

    embed.addField('Time on Fire', `**Average**: ${c.average_stats.time_spent_on_fire_avg}\n**Most**: ${c.game_stats.time_spent_on_fire_most_in_game}\n**Total**: ${c.game_stats.time_spent_on_fire}`, true)

    embed.setFooter(client.user.username, client.user.avatarURL)

    return message.channel.send('', {embed})
  })
  .usage(`!ow <battletag> [region (us, eu, kr)]`)
  .define(`displays competitive statistics for the given battletag`)

  bot.command(/^!(ow|overwatch) qp ([^0-9\s](\S{2,11})#(\d{4,}))( (eu|us|kr))?$/i, async (message, match) => {
    return message.channel.send(`WIP`)
  })
  .usage(`!ow qp <battletag> [region (us, eu, kr)]`)
  .define(`displays quickplay statistics for the given battletag`)
}
