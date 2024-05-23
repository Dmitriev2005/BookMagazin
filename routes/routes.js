import express from 'express'
import {getIndex,getGenre,getSubgenre,getNewBookRow,getImage} from '../controllers/controller.js'
const router = express.Router()

router.get('/',getIndex)
//Получение жанров и поджанров
router.get('/json/get-genre',getGenre)
router.get('/json/get-subgenre',getSubgenre)
//Получение книг этого года(новинок)
router.get('/json/get-new-book-row', getNewBookRow)
//Маршрут для картинок
router.get('/get-image/:imageName',getImage)
//Маршрут для страницы книги
router.get('/content/get-book/:bookName')
//Маршрут для содуржимого страницы книги
router.get('/json/get-book/:bookName')
export const exportRouter = router