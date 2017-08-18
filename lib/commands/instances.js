class Instances {
  constructor () {
    this.instances = new Map()
  }

  has (id) {
    return this.instances.has(id)
  }

  get (id) {
    if (!this.has(id)) return false
    return this.instances.get(id)
  }

  create (id, data) {
    return this.instances.set(id, {
      voiceChannel: data.voiceChannel || false,
      connection: data.connection || false,
      dispatcher: data.dispatcher || false
    })
  }

  update (id, data) {
    const currentInstance = this.get(id)
    if (!currentInstance) return false
    return this.instances.set(id, Object.assign({}, currentInstance, data))
  }

  delete (id) {
    return this.instances.delete(id)
  }
}

module.exports = new Instances()
