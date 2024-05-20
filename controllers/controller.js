import { Op, json } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series, Discount, 
  Author, AuthorBook, Book, Basket, 
  UserOrder, SeriesBook, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit} from "../helpers/functionForServer.js"
import 'dotenv/config'


const getIndex = (req,res) =>{
  
  res.render("./pages/index",{title:"Home"})
}

const getGenre = async(req,res) =>{
  const answer = await Genre.findAll()
  const answerAr = []
   await answer.forEach(item=>{
    let buffer = item.dataValues
    buffer.reference = process.env.SITE_INDEX_PAGE+'book/'+translit(+buffer.name)
    answerAr.push(buffer)
  })

  res.status(200).json(answerAr)
}
const getSubgenre = async(req,res) =>{
  const answer = await Subgenre.findAll()
  const answerAr = []
  await answer.forEach(item=>{
    let buffer = item.dataValues
    buffer.reference = process.env.SITE_INDEX_PAGE+'book/'+translit(+buffer.name)
    answerAr.push(buffer)
  })
  res.status(200).json(answerAr)
}
const getNewBookRow = async(req,res)=>{
  const books = await Book.findAll({
    where:{
      yearPublishing:{
        [Op.eq]:(new Date()).getFullYear()
      }
      
    },
    limit:6
  })
  if(books.length>0){
    res.status(200).json(books)
    console.log(books)
  }
}
export {getIndex, getGenre, getSubgenre, getNewBookRow}
//выдача токена
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})