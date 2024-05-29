import express from 'express'
import {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson} from '../controllers/sotrudnik.js'
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

routerSotrudnik.get('/sotrudnik/json/get-edit-book-genre-subgenre/:id',getGenre)
export{routerSotrudnik}
