import express from 'express'
import {getIndex,getGenre,getSubgenre} from '../controllers/controller.js'
const router = express.Router()

router.get('/',getIndex)
//Получение жанров и поджанров
router.get('/json/get-genre',getGenre)
router.get('/json/get-subgenre',getSubgenre)
//Отправка выбранного жанра

export const exportRouter = router