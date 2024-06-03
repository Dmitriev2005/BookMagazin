import express from 'express'
import {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson,
    getCurrentSubgenreGenre,getGenreSubgenre,
    getCurrentAuthor,getAllAuthors,getPubSeries,getAllSeriesBooks,postEditBook,postImg,getNewBookPage} from '../controllers/sotrudnik.js'
import { uplaodS } from '../helpers/functionForServer.js'
const routerSotrudnik = express.Router()

//Маршрут сотрудника для страницы списка книг
routerSotrudnik.get('/sotrudnik/content/get-book-list',getBookList)
//Маршрут сотрудника для получения json всех книг
routerSotrudnik.get('/json/get-all-books',getAllBooks)
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

export{routerSotrudnik}
