import express from 'express'
import {getIndex,getGenre,getSubgenre,getNewBookRow,
    getImage,getBookPage,getBookJson,getSearch, 
    getBasket,getPlacingOrder,getPayForm, 
    getRegistration,getListOrder,
    getShortcut,postAddInBasket,getBasketUserList,
    getDeleteBasketItem,getBookForSubgenre,
    getBookFromSub,postSaveReviewBuyer,getSearchJSON,postSavePlaceOrder} from '../controllers/buyer.js'
const buyerRouter = express.Router()

buyerRouter.get('/',getIndex)
//Получение жанров и поджанров
buyerRouter.get('/json/get-genre',getGenre)
buyerRouter.get('/json/get-subgenre',getSubgenre)
//Получение книг этого года(новинок)
buyerRouter.get('/json/get-new-book-row', getNewBookRow)
//Маршрут для картинок
buyerRouter.get('/get-image/:imageName',getImage)
//Маршрут для страницы книги
buyerRouter.get('/content/get-book/:bookId',getBookPage)
//Маршрут для содуржимого страницы книги
buyerRouter.get('/json/get-book/:bookId',getBookJson)
//Маршрут для страницы поиска
buyerRouter.get('/content/get-search',getSearch)
//Маршрут для страницы корзины(нужно будет добавить номер заказа в пути)
buyerRouter.get('/buyer/content/get-basket',getBasket)

//Маршрут для страницы оформления заказа
buyerRouter.get('/content/get-placing-order',getPlacingOrder)
//Маршрут для формы оплаты заказа(нужно будет добавить номер заказа в пути)
buyerRouter.get('/content/get-pay-form',getPayForm)
//Маршрут для страницы регистрации
buyerRouter.get('/content/get-registr',getRegistration)
//Маршрут для страницы заказов
buyerRouter.get('/buyer/content/get-list-order',getListOrder)
//Добавление книги в корзину
buyerRouter.post('/buyer/save/add-book-in-basket',postAddInBasket)
//Получить страницу корзины
buyerRouter.get('/buyer/get-basket-list',getBasketUserList)
//Удалить книгу из корзины
buyerRouter.get('/buyer/basket-delete-item/:id',getDeleteBasketItem)
//Получить страницу поджанра с книгами
buyerRouter.get('/buyer/content/get-book-choose-subgenre',getBookForSubgenre)
//Получить список книг согласно поджанру
buyerRouter.get('/buyer/json/get-book-from-subgenre/:id',getBookFromSub)
//Отправка отзыва клиентом на модерацию
buyerRouter.post('/buyer/save/review',postSaveReviewBuyer)
//Получение искомых книг через главный поиск
buyerRouter.get('/buyer/json/get-search/:search',getSearchJSON)
//Сохранить заказ пользователя
buyerRouter.post('/buyer/save/placingOrder',postSavePlaceOrder)

//Для БЫСТРОГО доступа к КЛИЕНТСКИМ страницам!!!!
buyerRouter.get('/sh',getShortcut)

export {buyerRouter}