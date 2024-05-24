import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series, Discount, 
  Author, AuthorBook, Book, Basket, 
  UserOrder, SeriesBook, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit} from "../helpers/functionForServer.js"
import 'dotenv/config'
import 'fs'
import path from "path"
//Путь к папке с изображениями
const __dirname = path.resolve()
const imageDirectory = path.join(__dirname,'nomenclature')
const getIndex = (req,res) =>{
  
  res.render("./pages/index",{title:"Новинки"})
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
//Получить книги этого года
const getNewBookRow = async(req,res)=>{
  const books = await Book.findAll({
    where:{
      yearPublishing:{
        [Op.eq]:(new Date()).getFullYear()
      } 
    }
  })
  if(books.length>0){
    res.status(200).json(books)
    console.log(books)
  }
}
const getImage = (req,res)=>{
  const imageName = req.params.imageName
  const imagePath = path.join(imageDirectory,imageName)
  res.sendFile(imagePath)
}
const getBookPage = async(req,res)=>{
  const idBook = req.params.bookId
  const book = await Book.findOne({
    where:Number(idBook)
  })
  res.status(200).render('./pages/book',{title:book.name})
}
const getBookJson = async(req,res)=>{
  const idBook = req.params.bookId
  const book = await Book.findOne({
    where:Number(idBook)
  })
  res.status(200).json(book)
}
export {getIndex, getGenre, getSubgenre, getNewBookRow, getImage, getBookPage, getBookJson}
//выдача токена
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})