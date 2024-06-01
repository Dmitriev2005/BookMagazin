import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series,
  Author, Book, Basket, 
  UserOrder, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit} from "../helpers/functionForServer.js"
import 'dotenv/config'
import 'fs'
import path from "path"

const getUserList = (req,res)=>{
    res.status(200).render('./pages/admin/adminListUser',{title:'Пользователи'})
}
  const getUserEdit = (req,res)=>{
    res.status(200).render('./pages/admin/adminEditUser',{title:'Редактировать пользователя'})
}
  const getEditComment = (req,res)=>{
    res.status(200).render('./pages/admin/adminComment',{title:'Просмотр комментария'})
}
export {getUserList,getUserEdit,getEditComment}