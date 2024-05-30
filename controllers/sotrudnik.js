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

const getOrder = (req,res)=>{
    res.status(200).render('./pages/sotrudnik/sotrudnikOrderEdit',{title:'Содержимое заказа'})
}
const getBookList = (req,res)=>{
    res.status(200).render('./pages/sotrudnik/sotrudnikBookList',{title:'Книги'})
}
const getAllBooks = async(req,res)=>{
    const books = await Book.findAll()
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
const getEditBook = (req,res)=>{
    res.status(200).render('./pages/sotrudnik/sotrudnikEditBook',{title:'Редактировать книгу'})
}
const getEditBookJson = async(req,res)=>{
    const idBook = req.params.id
    const book = await Book.findOne({
        where:{
            id:Number(idBook)
        }
    })
    console.log(idBook)
    res.status(200).json(book.dataValues)
}
const getGenreSubgenre = async(req,res)=>{
    const idBook = req.params.id
    const subGenreId = await SubgenreBook.findOne({
        where:{
            bookFk:Number(idBook)
        }
    })
    const subgenre = await Subgenre.findOne({
        where:{
            id:subGenreId.get("subgenreFk")
        }
    })
    const genre = await Genre.findOne({
        where:{
            id:subgenre.get("genreFk")
        }
    })
    const responseObj = {
        subgenre,
        genre
    }
    responseObj.subgenre = {...subgenre.dataValues}
    responseObj.genre = {...genre.dataValues}
    console.log(responseObj)
    res.status(200).json(responseObj)
}
export {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson,getGenreSubgenre}