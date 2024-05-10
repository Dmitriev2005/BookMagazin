import { json } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series, Discount, 
  Author, AuthorBook, Book, Basket, 
  UserOrder, SeriesBook, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit} from "../helpers/functionForServer.js"
import 'dotenv/config'


export const getIndex = (req,res) =>{
  
  res.render("./pages/index",{title:"Home"})
}

export const getGenre = async(req,res) =>{
  const answer = await Genre.findAll()
  const answerAr = []
   await answer.forEach(item=>{
    let buffer = item.dataValues
    buffer.reference = translit(process.env.SITE_INDEX_PAGE+'book/'+buffer.name)
    answerAr.push(buffer)
  })

  console.log(answerAr)
  res.status(200).json(answerAr)
}
export const getSubgenre = async(req,res) =>{
  const answer = await Subgenre.findAll()
  const answerAr = []
  await answer.forEach(item=>{
    let buffer = item.dataValues
    buffer.reference = translit(process.env.SITE_INDEX_PAGE+'book/'+buffer.name)
    answerAr.push(buffer)
  })
  console.log(answerAr)
  res.status(200).json(answerAr)
}
const getBook = (req,res)=>{
   
}
//выдача токена
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})