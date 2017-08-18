const { promisify } = require('util')
const { readdir } = require('fs')
const { resolve } = require('path')
const readDirAsync = promisify(readdir)
const Bot = require('./Bot')

module.exports = async (config, client) => {
  let plugin_files
  try {
    plugin_files = await readDirAsync(resolve(__dirname, '../plugins'))
  } catch (error) {
    console.error(error)
  }

  const bot = new Bot

  plugin_files.forEach(file => {
    const plugin = require(resolve(__dirname, `../plugins/${file}`))
    plugin(bot, config, client)
  })

  return bot
}
