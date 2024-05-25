import express from 'express'
import {getIndex,getGenre,getSubgenre,getNewBookRow,
    getImage,getBookPage,getBookJson,getSearch, getBasket,getPlacingOrder,getPayForm} from '../controllers/controller.js'
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
//Маршрут для страницы корзины(нужно будет добавить номер заказа в пути)
router.get('/content/get-basket',getBasket)
//Маршрут для страницы оформления заказа
router.get('/content/get-placing-order',getPlacingOrder)
//Маршрут для формы оплаты заказа(нужно будет добавить номер заказа в пути)
router.get('/content/get-pay-form',getPayForm)
export const exportRouter = router