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
  const regions = [stats.eu, stats.us, stats.kr].filter(v => v) // remove null values
  if (regions.length < 1) return undefined // No playtime at all
  if (regions.length === 1) return regions[0].stats

  let highest = { regionStats: undefined, time: 0 }
  regions.forEach(region => {
    let compTime = region.stats.competitive.game_stats.time_played
    let quickTime = region.stats.quickplay.game_stats.time_played
    let totalTime = compTime + quickTime
    if (highest.time < totalTime) {
      highest.time = totalTime
      highest.regionStats = region.stats
    }
  })

  return highest.regionStats
}

module.exports = (bot, config, client) => {
  bot.command(/^!(ow|overwatch) ([^0-9\s](\S{2,11})#(\d{4}))( (eu|us|kr))?$/i, async (message, match) => {
    const battletag = match[2]
    const givenRegion = match[6]

    let stats
    try {
      stats = await getStats(battletag)
    } catch (error) {
      console.error(error)
      return message.channel.send(`Couldn't get stats for that battletag`)
    }

    if (givenRegion && !stats[givenRegion]) return message.channel.send(`No stats found for that battletag in the ${givenRegion} region`)

    let regionStats = givenRegion ? stats[givenRegion].stats : statsFromMostPlayedRegion(stats)

    if (!regionStats) return message.channel.send(`No stats found for that battletag`)

    console.log(`regionStats`, regionStats)

    return message.channel.send(`Found`)
  })
  .usage(`!ow <battletag> [region (us, eu, kr)]`)
  .define(`displays competitive statistics for the given battletag`)

  bot.command(/^!(ow|overwatch) qp ([^0-9\s](\S{2,11})#(\d{4}))( (eu|us|kr))?$/i, async (message, match) => {
    return message.channel.send(`WIP`)
  })
  .usage(`!ow qp <battletag> [region (us, eu, kr)]`)
  .define(`displays quickplay statistics for the given battletag`)
}
