import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series,
  Author, Book, Basket, 
  Order, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit, shortCut} from "../helpers/functionForServer.js"
import 'dotenv/config'
import 'fs'
import path from "path"

const getUserList = (req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    res.status(200).render('./pages/admin/adminListUser',{title:'Пользователи'})
  }
  else
    res.status(404).send("Страница не найдена")

}
const getUserEdit = (req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    res.status(200).render('./pages/admin/adminEditUser',{title:'Редактировать пользователя'})
  }
  else
    res.status(404).send("Страница не найдена")

}
const getEditComment = (req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    res.status(200).render('./pages/admin/adminComment',{title:'Просмотр комментария'})
  }
  else
    res.status(404).send("Страница не найдена")
}
export {getUserList,getUserEdit,getEditComment}