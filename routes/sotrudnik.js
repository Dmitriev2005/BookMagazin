import express from 'express'
import {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson,
    getCurrentSubgenreGenre,getGenreSubgenre,
    getCurrentAuthor,getAllAuthors,getPubSeries,
    getAllSeriesBooks,postEditBook,postImg,getNewBookPage,
    getDeleteBook,getNewGenrePage,postNewGenreSub,
    getOneGenreManySubgenre,getAllGenre,getEditGenre,getAuthor,
    getPageAuthor,postNewauthor,getAuthorForEdit,
    postEditAuthor,getDeleteAuthor,getNewPub,getPubSeriesConstraint,
    postNewPub,getJsonEditPub,postEditPub,postEditGenre,
    delGenre,delPub,getAllOrders,getChangeOrders,postStatusOrder} from '../controllers/sotrudnik.js'
import { uplaodS } from '../helpers/functionForServer.js'
const routerSotrudnik = express.Router()

//Маршрут сотрудника для страницы списка книг
routerSotrudnik.get('/sotrudnik/content/get-book-list',getBookList)
//Маршрут сотрудника для получения json всех книг
routerSotrudnik.get('/sotrudnik/json/get-all-books',getAllBooks)
//Маршрут сотрудника для изменения книги
routerSotrudnik.get('/sotrudnik/content/get-edit-book',getEditBook)
//Маршрут сотрудника для сбора заказа
routerSotrudnik.get('/sotrudnik/content/get-order',getOrder)
//Маршрут сотрудника получения книг для редактирования
routerSotrudnik.get('/sotrudnik/json/get-edit-book/:id',getEditBookJson)

//Маршрут сотрудника получения текущего жанра и поджанра книги
routerSotrudnik.get('/sotrudnik/json/get-current-edit-book-genre-subgenre/:id',getCurrentSubgenreGenre)
//Маршрут для получения всех жанров и поджанров книг
routerSotrudnik.get('/sotrudnik/json/get-edit-book-genre-subgenre',getGenreSubgenre)
//Получение текущего автора
routerSotrudnik.get('/sotrudnik/json/get-current-author/:id',getCurrentAuthor)
//Получение всех авторов
routerSotrudnik.get('/sotrudnik/json/get-all-authors',getAllAuthors)
//Получение текущего издания и серии
routerSotrudnik.get('/sotrudnik/json/get-current-pub-series/:id',getPubSeries)
//Получение всех издателей
routerSotrudnik.get('/sotrudnik/json/get-all-series-pub',getAllSeriesBooks)

//Сохранение изменений в книге
routerSotrudnik.post('/sotrudnik/save/post-edit-book/:id',postEditBook)
//Сохранение картинки
routerSotrudnik.post('/sotrudnik/save/img/:id',uplaodS,postImg)
//Добавление новой книги
routerSotrudnik.get('/sotrudnik/content/get-new-book',getNewBookPage)
//Удаление книги
routerSotrudnik.get('/sotrudnik/delete/delete-book/:id',getDeleteBook)
//Страница добавления книги
routerSotrudnik.get('/sotrudnik/content/get-new-genre',getNewGenrePage)
//Получение выбранного жанра с поджанрами
routerSotrudnik.get('/sotrudnik/json/get-one-genre-subgenre/:id',getOneGenreManySubgenre)
//Сохранение жанра
routerSotrudnik.post('/sotrudnik/save/post-new-genre',postNewGenreSub)
//Получение всех жанров
routerSotrudnik.get('/sotrudnik/json/get-all-genre',getAllGenre)
//Получение страницы редактирования жанра
routerSotrudnik.get('/sotrudnik/content/get-edit-genre',getEditGenre)
//Получение авторов
routerSotrudnik.get('/sotrudnik/json/get-all-author',getAuthor)
//Получения страницы авторов
routerSotrudnik.get('/sotrudnik/content/get-page-author',getPageAuthor)
//Сохранение нового автора
routerSotrudnik.post('/sotrudnik/save/post-new-author',postNewauthor)
//Получение автора
routerSotrudnik.get('/sotrudnik/json/get-author/:id',getAuthorForEdit)
//Сохранение измененного автора
routerSotrudnik.post('/sotrudnik/save/post-edit-author',postEditAuthor)
//Удаление автора
routerSotrudnik.get('/sotrudnik/save/get-delete-author/:id',getDeleteAuthor)
//Получение страницы издательства
routerSotrudnik.get('/sotrudnik/content/get-publishing',getNewPub)
//Получение издательств и связанных с ними серии 
routerSotrudnik.get('/sotrudnik/json/get-pub-series',getPubSeriesConstraint)
//Сохранить новое издетельство
routerSotrudnik.post('/sotrudnik/save/post-new-publishing',postNewPub)
//Получить редактируемое издательство
routerSotrudnik.get('/sotrudnik/json/get-one-publishing-subpublishing/:id',getJsonEditPub)
//Сохранить измененное издательство 
routerSotrudnik.post('/sotrudnik/save/post-edit-publishing/:id',postEditPub)
//Сохранить измененный жанр
routerSotrudnik.post('/sotrudnik/save/post-edit-genre/:id',postEditGenre)
//Удаление жанра
routerSotrudnik.get('/sotrudnik/delete/delete-genre/:id',delGenre)
//Удаление издательства
routerSotrudnik.get('/sotrudnik/delete/del-publishing/:id',delPub)
//Получение всех заказов
routerSotrudnik.get('/sotrudnik/json/get-all-orders',getAllOrders)
//Получение выбранного заказа
routerSotrudnik.get('/sotrudnik/json/get-change-order/:id',getChangeOrders)
//Сохранение статуса заказа
routerSotrudnik.post('/sotrudnik/save/post-status-order',postStatusOrder)


export{routerSotrudnik}
