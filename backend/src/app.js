const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const path=require("path")
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}))
app.use(express.static("./public"))
/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"))
    })
module.exports = app