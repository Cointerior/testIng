const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClientProSchema = new Schema({
  name: String,
  email: String,
  phone: String
})

module.exports = mongoose.model("ClientPro", ClientProSchema)