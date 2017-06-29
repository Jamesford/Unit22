// Fisher-Yates Shuffle (from https://stackoverflow.com/a/6274398)
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const default_trivia = require('./question_sets/default.js')

const startGame = function (channelId, questionSet, pointsToWin) {
  return {
    id: channelId,
    currentQuestion: null,
    pointsToWin: pointsToWin,
    points: {},
    questionPool: [...shuffle(questionSet)]
  }
}

let games = {}

module.exports = (bot, config, client) => {
  bot.command(/^!trivia start$/i, (message, match) => {
    if (games[message.channel.id]) return message.channel.send('Trivia game already in progress')

    games[message.channel.id] = startGame(message.channel.id, default_trivia, 2)
    
    let game = games[message.channel.id]
    game.currentQuestion = game.questionPool.pop()

    message.channel.send('Starting a new trivia game! Default question set!')
    setTimeout(() => {
      message.channel.send(`\`\`\`${game.currentQuestion.question}\`\`\``)
    }, 1000)
  })
  .usage('!trivia start')
  .define('starts a trivia game')

  bot.command(/^!(ans|answer) (.*)$/i, (message, match) => {
    if (!games[message.channel.id]) return message.channel.send('No trivia game is in progress')
    if (!games[message.channel.id].currentQuestion) return message.channel.send(`Too slow ${message.author.username}!`)

    let game = games[message.channel.id]
    const attempt = match[2]
    const answer = game.currentQuestion.answer

    if (attempt.toLowerCase() !== answer.toLowerCase()) return message.channel.send(`*__${attempt}__* is not correct ${message.author.username}!`)

    game.currentQuestion = null
    game.points[message.author.username] ? game.points[message.author.username]++ : game.points[message.author.username] = 1
    message.channel.send(`*__${attempt}__* is correct, 1 point for ${message.author.username}!`)

    // No questions remaining, highest score wins
    if (game.questionPool.length === 0) {
      return setTimeout(() => {
        message.channel.send(`${message.author.username} wins`)
        delete games[message.channel.id]
      }, 1000)
    }

    // First to X wins
    if (game.pointsToWin && game.points[message.author.username] === game.pointsToWin) {
      return setTimeout(() => {
        message.channel.send(`${message.author.username} wins`)
        delete games[message.channel.id]
      }, 1000)
    }

    // Continue with next question
    setTimeout(() => {
      game.currentQuestion = game.questionPool.pop()
      message.channel.send(`\`\`\`${game.currentQuestion.question}\`\`\``)
    }, 1000)
  })
  .usage('!ans <your answer>')
  .define('attempt to answer the trivia question')

  bot.command(/^!trivia scores$/i, message => {
    if (!games[message.channel.id]) return message.channel.send('No trivia game is in progress')

    const { points, pointsToWin } = games[message.channel.id]

    var scores = Object.keys(points).map(user => ({ user: user, value: points[user] })).sort((a, b) => a.value < b.value)
    var s = 'Current Trivia Scores\n```Score - Player Name\n\n'
    scores.forEach(score => {
      s += `${score.value} - ${score.user}\n\n`
    })
    s += '```'
    if (pointsToWin) s += `\nPoints to win: ${pointsToWin}`
    return message.channel.send(s)
  })
  .usage('!trivia scores')
  .define('show the scores for the current trivia game')
}
