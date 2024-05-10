import express from 'express'
import {getIndex,getGenre,getSubgenre,getBook} from '../controllers/controller.js'
const router = express.Router()

router.get('/',getIndex)
//Получение жанров и поджанров
router.get('/json/get-genre',getGenre)
router.get('/json/get-subgenre',getSubgenre)
//Получение книг
router.get('/json/get-book', getBook)
export const exportRouter = router