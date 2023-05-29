const mongoose = require("mongoose")
const { db: { host, port, name } } = require("../configs/config.mongodb")

class Database {

// use strategy pattern
  constructor(type){
    this.connect(type)
  }

  mongodbConnect(){
    const connectString = `mongodb://${host}:${port}/${name}`
    mongoose.connect(connectString)
      .then( _ => {
        console.log("Connected to mongodb success!")
      })
      .catch( (err) => {
        console.log("Connect to mongodb failed")
      })

    // dev
    if(1 === 1){
      mongoose.set("debug", true)
      mongoose.set("debug", { color: true })
    }

  }

  connect(type) {
    return {
      mongodb: this.mongodbConnect
    }[type]()
  }

  static getInstance(type){
    if(!Database.instance){
      Database.instance = new Database(type)
    }
    return Database.instance 
  }
}

const instance = Database.getInstance("mongodb")

module.exports = instance