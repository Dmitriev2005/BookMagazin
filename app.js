import express from "express"
import  {exportRouter} from "./routes/routes.js"
import cookieParser from "cookie-parser"
const app = express()

app.set("view engine","ejs")
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())
app.use(exportRouter)
app.listen(8000,()=>console.log("Server work..."))