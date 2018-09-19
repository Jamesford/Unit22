const Player = require('./Player')

class Players {
  constructor () {
    this.players = new Map()
  }

  getPlayer (id) {
    if (this.players.has(id)) {
      return this.players.get(id)
    } else {
      const player = new Player(id)
      this.players.set(id, player)
      return player
    }
  }
}

module.exports = new Players()
