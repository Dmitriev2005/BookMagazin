import express from "express"
import {getIndex,getGenre,getSubgenre} from "../controllers/controller.js"
const router = express.Router()

router.get("/",getIndex)
//Получение жанров и поджанров
router.get("/get-genre",getGenre)
router.get("/get-subgenre",getSubgenre)


export const exportRouter = router