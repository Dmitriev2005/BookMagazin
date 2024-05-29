import {getUserList,getUserEdit,getEditComment} from '../controllers/admin.js'
import express from 'express'
const routerAdmin = express.Router()

//Маршрут страницы админа для списка пользователей
routerAdmin.get('/admin/content/get-user-list',getUserList)
//Маршрут страницы админа для изменения пользователя
routerAdmin.get('/admin/content/get-user-edit',getUserEdit)
//Маршрут страницы админа для модерирования комментариями
routerAdmin.get('/admin/content/get-edit-comment',getEditComment)
export {routerAdmin}