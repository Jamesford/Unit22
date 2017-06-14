const request = require('request')
const _ = require('lodash')

module.exports = (bot, config, client) => {
  function getSteamID (username) {
    return new Promise((resolve, reject) => {
      const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${config.steam_key}&vanityurl=${username}&format=json`
      return request(url, (err, _, body) => {
        if (err) return reject(err)
        const json = JSON.parse(body)
        if (!json.response || !json.response.steamid) return reject({ message: 'NO-ID', username: username })
        return resolve(json.response.steamid)
      })
    })
  }

  function getOwnedGames (id) {
    return new Promise((resolve, reject) => {
      const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steam_key}&steamid=${id}&format=json`
      return request(url, (err, _, body) => {
        if (err) return reject(err)
        // Format to array of steam appid's [10, 20, 30, 40, 50, ...]
        return resolve(JSON.parse(body).response.games.map(g => g.appid))
      })
    })
  }

  function getGameInfo (id) {
    return new Promise((resolve, reject) => {
      // Official API
      // const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${config.steam_key}&appid=${id}&format=json`
      // Unlisted API
      const url = `https://store.steampowered.com/api/appdetails/?appids=${id}`
      return request(url, (err, _, body) => {
        if (err) return reject(err)
        // Format to array of steam appid's [10, 20, 30, 40, 50, ...]
        const json = JSON.parse(body)
        if (!json[id].success) return resolve(null)
        const data = json[id].data
        return resolve({
          type: data.type,
          name: data.name,
          developer: data.developers[0],
        })
      })
    })
  }

  bot
    .command(/^!steam$/i, async (message, match) => {
      const steamNames = ['SpoonooqZ', 'VageSky', 'smazatak'] // ninjahh-93

      let steamIds
      try {
        steamIds = await Promise.all(steamNames.map(async name => await getSteamID(name)))
      } catch (error) {
        if (error.message && error.message === 'NO-ID') {
          return message.channel.send(`Couldn't find the ID for \`${error.username}\``)
        } else {
          console.error(error)
          return message.channel.send(`Couldn't lookup steamids for those usernames`)
        }
      }

      let gameIds
      try {
        gameIds = await Promise.all(steamIds.map(async id => await getOwnedGames(id)))
      } catch (error) {
        console.error(error)
        return message.channel.send(`Couldn't lookup games for those usernames`)
      }

      const intersectingIds = _.intersection(...gameIds)

      let appsInCommon
      try {
        appsInCommon = await Promise.all(intersectingIds.map(async id => await getGameInfo(id)))
      } catch (error) {
        console.error(error)
        return message.channel.send(`Couldn't lookup game metadata for those usernames`)
      }

      const gamesInCommon = appsInCommon.filter(g => g && g.type === 'game')

      // Ridiculous work-around of the 2000 character message length limit

      let response = []
      let pos = 0

      response[pos] = `**Steam Games in Common**\n*for ${steamNames.join(', ')}*\n`

      gamesInCommon.forEach(game => {
        let gameText = `\n**${game.name}**\n${game.developer}\n`

        if (response[pos].length + gameText.length > 2000) {
          pos++
          response[pos] = gameText
        } else {
          response[pos] += gameText
        }
      })

      return response.forEach(text => {
        return message.channel.send(text)
      })
    })
    .usage('!steam')
    .define(`list steam games in common for players`)
}
