require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express")
const schema = require("./schema/schema")
const connectDB = require("./db/dbconn")
const { graphqlHTTP } = require("express-graphql")

const app = express()

connectDB()

const PORT = process.env.PORT || 3500
app.use(graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === "development"
}))


mongoose.connection.once("open", () => {
  console.log("connected to db")
  app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
}) 
})
