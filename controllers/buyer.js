import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series, Discount, 
  Author, Book, Basket, 
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
 const author = await Author.findAll()
 const outputBook = []

 author.forEach(aItem=>{
    books.forEach(bItem=>{
      if(aItem.dataValues.id===bItem.dataValues.authorFk)
        outputBook.push({...aItem.dataValues, ...bItem.dataValues})
    })
    
 })
 res.status(200).json(outputBook)


}
const getImage = (req,res)=>{
  const imageName = req.params.imageName
  const imagePath = path.join(imageDirectory,imageName)
  res.sendFile(imagePath)
}
//Возвращает страницу книги
const getBookPage = async(req,res)=>{
  const idBook = req.params.bookId
  const book = await Book.findOne({
    where:Number(idBook)
  })
  res.status(200).render('./pages/book',{title:book.name})
}
//Возвращает содержимое страницы книги
const getBookJson = async(req,res)=>{
  const idBook = req.params.bookId
  const book = await Book.findOne({
    where:Number(idBook)

  })
  const review = await Review.findAll({
    where:{
      bookFk:Number(idBook)
    }
  })
  let bufferBuffer = {}
  let bufferForReview = {}
  bufferForReview.arReview = []
  const userIdReview = []

  //Заполняем массив id пользователей, в которых есть отзыв на данную книгу
  review.forEach(item=>{  
    userIdReview.push(item.dataValues.userFk)
  })
  //Ищем совпадающих пользователей по массиву
  const userFromReview = await User.findAll({
    where:{
      id:{
        [Op.in]:userIdReview
      }
    }
  })
  //Заполняем свойство ararReview склейкой двух объектов
  //С помощью find проверяем свопадает ли текущий элемент итерации отзыва и пользователя(тот ли id)
  for(let i=0; i<userFromReview.length; i++){
      const oneReview = review.find(q=>q.dataValues.userFk===userFromReview[i].dataValues.id)
      bufferBuffer = {...userFromReview[i].dataValues, ...oneReview.dataValues}
      bufferForReview.arReview.push(bufferBuffer)
   
  }
  console.log(bufferForReview.arReview)
  //Склеиваем объект книги с объектов озывов и пользователей
  const generalInfoBook = {...book.dataValues, ...bufferForReview}
  //console.log(generalInfoBook)
  res.status(200).json(generalInfoBook)
}
const getSearch = (req,res) =>{
  res.status(200).render('./pages/search',{title:'Результаты поиска'})
}
const getBasket = (req,res)=>{
  res.status(200).render('./pages/basket',{title:'Корзина'})
}
const getPlacingOrder = (req,res)=>{
  res.status(200).render('./pages/placingAnOrder',{title:'Оформление заказа'})
}
const getPayForm = (req,res) => {
  res.status(200).render('./pages/formBuy',{title:'Оплата заказа'})
}
const getAuthorisation = (req,res)=>{
  res.status(200).render('./pages/authorisation',{title:'Авторизация'})
}
const getRegistration = (req,res)=>{
  res.status(200).render('./pages/registration',{title:'Регистрация'})
}
const getListOrder  = (req,res)=>{
  res.status(200).render('./pages/listOrder',{title:'Заказы'})
}


const getShortcut = (req,res)=>{
  res.status(200).render('./pages/hotkey(TEST!!!)/shorcutCLIENTPage')
}


export {getIndex, getGenre, getSubgenre, getNewBookRow, 
  getImage, getBookPage, getBookJson,getSearch,
  getBasket,getPlacingOrder,getPayForm,
  getAuthorisation,getRegistration,
  getListOrder,getShortcut}
//выдача токена
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})
