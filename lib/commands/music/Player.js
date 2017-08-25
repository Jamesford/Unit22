class Instance {
  constructor (id) {
    this.id = id
    this.voiceChannel = null
    this.connection = null
    this.dispatcher = null

    this.textChannel = null
    this.queue = []
  }
}

class Player {
  constructor () {
    this.instances = new Map()
  }

  getInstance (id) {
    if (this.instances.has(id)) {
      return this.instances.get(id)
    } else {
      const instance = new Instance(id)
      this.instances.set(id, instance)
      return instance
    }
  }

  async playVideo (id, url) {
    let instance = this.instances.get(id)

    const connection = await instance.voiceChannel.join()
    

  }

}

// test code

let player = new Player()

let instance = player.getInstance('a')

console.log(player.instances)

console.log(instance)
