import express from 'express'
const autoRegRouter = express.Router()
import { getAuthorisation,postAuthorisation,getDeleteCookie} from '../controllers/authorisationRegistration.js'

//Получить страницу авторизации
autoRegRouter.get('/content/get-autoris',getAuthorisation)
//Отправить данные авторизации
autoRegRouter.post('/save/post-autoris',postAuthorisation)
//Удалить куку сесии пользователя
autoRegRouter.get('/delete-cookie',getDeleteCookie)

export {autoRegRouter}