import express from "express"

const app  = express()


console.log("hello")
app.listen(4000,() => console.log("server is running"))