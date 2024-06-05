import express from "express"
import  {buyerRouter} from "./routes/buyer.js"
import { routerAdmin } from "./routes/admin.js"
import { routerSotrudnik } from "./routes/sotrudnik.js"
import { autoRegRouter } from "./routes/authorisationRegistration.js"
import cookieParser from "cookie-parser"
const app = express()

app.set("view engine","ejs")
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

app.use(buyerRouter)
app.use(routerAdmin)
app.use(routerSotrudnik)
app.use(autoRegRouter)
app.listen(9001,()=>console.log("Server work..."))