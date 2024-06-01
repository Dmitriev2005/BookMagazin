import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series,
  Author, Book, Basket, 
  UserOrder, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit,upload} from "../helpers/functionForServer.js"
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
const getCurrentSubgenreGenre = async(req,res)=>{
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
    res.status(200).json(responseObj)
}
const getGenreSubgenre = async(req,res)=>{
    const genre = await Genre.findAll()
    const subgenre = await Subgenre.findAll()

    const genreAr = []
    const subgenreAr = []
    genre.forEach(item=>{
        genreAr.push(item.dataValues)
    })
    subgenre.forEach(item=>{
        subgenreAr.push(item.dataValues)
    })
    const responseObj = {
        genre:genreAr,
        subgenre:subgenreAr
    }
    res.status(200).json(responseObj)
}
const getCurrentAuthor = async(req,res)=>{
    const idBook = req.params.id
    const authorId = await Book.findOne({
        where:{
            id:Number(idBook)
        }
    })
    const author = await Author.findOne({
        where:{
            id:authorId.get("authorFk")
        }
    })
    res.status(200).json(author.dataValues)
}
const getAllAuthors = async(req,res)=>{
    const authors = await Author.findAll()
    const authorsAr = []
    authors.forEach(item=>{
        authorsAr.push(item.dataValues)
    })
    console.log(authorsAr)
    res.status(200).json(authorsAr)
}
const getPubSeries = async(req,res)=>{
    const idBook = req.params.id
    const book = await Book.findOne({ 
        where:{
            id:Number(idBook)
        }   
    })
    const series = await Series.findOne({
        where:{
            id:book.get("seriesFk")
        }
    })
    const publishing = await  Publishing.findOne({
        where:{
            id:series.get("publishingFk")
        }
    })
    const responseObj = {
        publishing:publishing.dataValues,
        series:series.dataValues
    }
    res.status(200).json(responseObj)
}
const getAllSeriesBooks = async(req,res)=>{
    const series = await Series.findAll({})
    const pub = await Publishing.findAll({})

    const seriesAr = []
    const pubAr = []
    
    series.forEach(item=>seriesAr.push(item.dataValues))
    pub.forEach(item=>pubAr.push(item.dataValues))

    const responseObj = {
        series:series,
        pub:pub
    }
    res.status(200).json(responseObj)
}
const postEditBook = async(req,res)=>{
    const idBook = req.params.id
    const dataFromClient = req.body
    console.log(dataFromClient)
    const answer = await Book.update({
        name:dataFromClient.name,
        discription:dataFromClient.discription,
        price:dataFromClient.price,
        discount:dataFromClient.discount,
        subgenreFk:dataFromClient.subgenre.id,
        authorFk:dataFromClient.author.id,
        seriesFk:dataFromClient.series.id
    },{where:{
        id:Number(idBook)
    }})
    if(answer.length>0)
        res.status(200).send("Запись добавлена")
}
export {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson,
    getCurrentSubgenreGenre,getGenreSubgenre,getCurrentAuthor,
    getAllAuthors,getPubSeries,getAllSeriesBooks,postEditBook}