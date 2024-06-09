import {getUserList,getUserEdit,getEditComment,
    getReviewList,getUserListJSON,getThisUser,saveUser} from '../controllers/admin.js'
import express from 'express'
const routerAdmin = express.Router()

//Маршрут страницы админа для списка пользователей
routerAdmin.get('/admin/content/get-user-list',getUserList)
//Маршрут страницы админа для изменения пользователя
routerAdmin.get('/admin/content/get-user-edit',getUserEdit)
//Маршрут страницы админа для модерирования комментариями
routerAdmin.get('/admin/content/get-edit-comment',getEditComment)
//Получить всех пользователей
routerAdmin.get('/admin/json/get-user-list',getUserListJSON)
//Получить все отзывы
routerAdmin.get('/admin/json/get-review-list',getReviewList)
//Получить конкертного пользователя
routerAdmin.get('/admin/json/get-this-user/:id',getThisUser)
//Сохранение или добавление пользователя
routerAdmin.post('/admin/save/this-user/:id',saveUser)


export {routerAdmin}