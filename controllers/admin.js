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
import { waitForDebugger } from "inspector"

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
const getUserListJSON = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    const userListDB = await User.findAll()
    const userListAr = []
    userListDB.forEach(item=>userListAr.push(item.dataValues))
    console.log(userListAr)
    res.status(200).json(userListAr)
  }
  else
    res.status(404).send("Страница не найдена")
}
const getReviewList = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    const reviewListDB = await Review.findAll({
      where:{
        status:'ожидание'
      }
    })
    const userListDB = await User.findAll()
    const respAr = []
    userListDB.forEach(item=>{
      reviewListDB.forEach(rItem=>{
        if(item.get('id')===rItem.get('userFk')){
          const buffer = {
            userId:item.get('id'),
            userName:item.get('name'),
            email:item.get('email'),
            lastname:item.get('lastname')
          }
          respAr.push({...buffer, ...rItem.dataValues})

        }
      })
    })
    console.log(respAr)
    res.status(200).json(respAr)
  }
  else
    res.status(404).send("Страница не найдена")
}
export {getUserList,getUserEdit,getEditComment,getUserListJSON,getReviewList}