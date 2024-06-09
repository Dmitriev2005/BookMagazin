import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series,
  Author, Book, Basket, 
  Order, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit, shortCut,generatePassword} from "../helpers/functionForServer.js"
import 'dotenv/config'
import 'fs'
import path from "path"
import nodemailer from "nodemailer"
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
const getThisUser = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    const idUser = Number(req.params.id)
    const responseUserDB = await User.findByPk(idUser)
    console.log(responseUserDB.dataValues)
    res.status(200).json(responseUserDB.dataValues)

  }
  else{
    res.status(404).send("Страница не найдена")
  }
}
const saveUser = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    const userId = req.params.id
    const password = await generatePassword(8)
    const reqUser = req.body
    if(userId==="undefined"){
      await User.create({
        name:reqUser.name,
        lastname:reqUser.lastname,
        email:reqUser.email,
        password:password,
        type:'работник'
      })
    
      res.status(200).send("Пользователь добавлен!")
    }
    else{
      await User.update({
        name:reqUser.name,
        lastname:reqUser.lastname,
        email:reqUser.email
      },{
        where:{
          id:Number(userId)
        }
      })
      res.status(200).send("Пользователь отредактирован!")

    }
     
  }
  else
    res.status(404).send("Страница не найдена")
}
const getReviewThis = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    console.log("ssfdsdsdsfdd")
    const idR = Number(req.params.id)
    const respDBRev = await Review.findByPk(idR)
    console.log(respDBRev)
    res.status(200).json(respDBRev.dataValues)
    // const body = req.body
    // const respDBRev = await Review.update(
    //   {status:body.status},
    //   {
    //     where:{
    //       id:idR
    //     }
    //   })
  }
  else
    res.status(404).send("Страница не найдена")
}
const getSaveCom = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    const idRew = Number(req.params.id)
    console.log(idRew)
    await Review.update(
      {status:"одобрено"},
      {
      where:{
        id:idRew
      }
    })
    res.status(200).send("Htlfr")
  }
  else
    res.status(404).send("Страница не найдена")
}
const getDelCom = async(req,res)=>{
  const user = shortCut(req)
  if(user.type==="администратор"){
    const idRew = Number(req.params.id)
    await Review.update(
      {status:"не одобрено"},
      {
      where:{
        id:idRew
      }
    })
    res.status(200).send("Htlfr")
  }
  else
    res.status(404).send("Страница не найдена")
}
export {getUserList,getUserEdit,getEditComment,getUserListJSON,
  getReviewList,getThisUser,saveUser,getReviewThis,getSaveCom,getDelCom}