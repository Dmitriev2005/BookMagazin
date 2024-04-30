import express from "express"
import  {exportRouter} from "./routes/routes.js"
import cookieParser from "cookie-parser"
import { GenreSubgenre, Subgenre } from "./models/model.js"
const app = express()

async function startServer() {
  
    // Найти одну запись из GenreSubgenre
    try {
      const res = await GenreSubgenre.findOne();
      const resSub = await Subgenre.findOne({where:{id:res.id}})
      console.log(resSub)
    } catch (error) {
      console.error('Ошибка при поиске GenreSubgenre:', error);
    }
}
startServer()
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())
app.use(exportRouter)
app.listen(8000,()=>console.log("Server work..."))