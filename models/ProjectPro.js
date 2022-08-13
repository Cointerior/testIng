const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProjectProSchema = new Schema({
  name: String,
  description: String,
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientPro"
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started"
  }
})

module.exports = mongoose.model("ProjecttPro", ProjectProSchema)