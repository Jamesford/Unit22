const config = require('./config.json')
const Bot = require('./lib/Bot')

const DevBot = new Bot(config)

// console.log('init', DevBot)

const main = async () => {
  try {
    // await DevBot.loadPlugins()
    console.log('Starting...')
    await DevBot.start()
    console.log('Started')
  } catch (err) {
    console.error(err)
  }
}

main()
