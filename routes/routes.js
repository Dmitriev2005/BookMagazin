import express from 'express'
import {getIndex,getGenre,getSubgenre,getNewBookRow,
    getImage,getBookPage,getBookJson,getSearch, getBasket} from '../controllers/controller.js'
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
router.get('/content/get-book/:bookId',getBookPage)
//Маршрут для содуржимого страницы книги
router.get('/json/get-book/:bookId',getBookJson)
//Маршрут для страницы поиска
router.get('/content/get-search',getSearch)
//Маршрут для страницы корзины
router.get('/content/get-basket',getBasket)

export const exportRouter = router