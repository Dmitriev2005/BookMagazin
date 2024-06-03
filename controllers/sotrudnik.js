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
import { title } from "process"

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
    res.status(200).render('./pages/sotrudnik/sotrudnikEditBook',{title:'Редактировать книгу',namePage:'Редактирование книги'})
}
const getEditBookJson = async(req,res)=>{
    const idBook = req.params.id
    const book = await Book.findOne({
        where:{
            id:Number(idBook)
        }
    })
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
    const book = dataFromClient.book
    const author = dataFromClient.author
    const series = dataFromClient.series
    const subgenre = dataFromClient.subgenre
    //Поджанр убрал тк они в другой таблице
    if(Number(idBook)){
        const answer = await Book.update({
            name:book.name,
            discription:book.discription,
            price:book.price,
            discount:book.discount,
            seriesFk:series.id,
            authorFk:author.id,
            ageRestrictions:book.ageRestrictions,
            dataAdd:new Date(),
            yearPublishing:book.yearPublishing,
            isbn:book.isbn,
            countPages:book.countPages,
            height:book.height,
            width:book.width,
            bookLength:book.bookLength,
            count:book.count,
            weigth:book.weigth,
            coverType:book.coverType,
            dataStopDiscount:book.dataStopDiscount,
            dataStartDiscount:book.dataStartDiscount
    
        },{where:{
            id:Number(idBook)
        }})
        await SubgenreBook.destroy({
            where:{
                bookFk:Number(idBook)
            }
        }) 
        const answerSubgenre = await SubgenreBook.create({
            bookFk:Number(idBook),
            subgenreFk:subgenre.id
        })
        if(answer.length>0&&!answerSubgenre.isNewRecord)
            res.status(200).send("Запись отредактирована")
    }
    else{
        const answer = await Book.create({
            name:book.name,
            discription:book.discription,
            price:book.price,
            discount:book.discount,
            seriesFk:series.id,
            authorFk:author.id,
            ageRestrictions:book.ageRestrictions,
            dataAdd:new Date(),
            yearPublishing:book.yearPublishing,
            isbn:book.isbn,
            countPages:book.countPages,
            height:book.height,
            width:book.width,
            bookLength:book.bookLength,
            count:book.count,
            weigth:book.weigth,
            coverType:book.coverType,
            dataStopDiscount:book.dataStopDiscount,
            dataStartDiscount:book.dataStartDiscount
    
        })
        const answerSubgenre = await SubgenreBook.create({
            bookFk:answer.get('id'),
            subgenreFk:subgenre.id
        })
        if(!answer.isNewRecord&&!answerSubgenre.isNewRecord)
            res.status(200).json(answer.dataValues)
    }
}
const postImg = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }
    res.status(200).send({ message: 'File uploaded successfully.' });
}
const getNewBookPage = (req, res) => {
    res.status(200).render('./pages/sotrudnik/sotrudnikEditBook',{title:'Добавление книги',namePage:'Добавление книги'})
}
const getDeleteBook = async(req,res)=>{
    const bookId = req.params.id
    const resDelteSub = await SubgenreBook.destroy({
        where:{
            bookFk:Number(bookId)
        }
    })
    const resDelete =  await Book.destroy({
        where:{
            id:bookId
        }
    })
    res.status(200).send("Запись удалена!")
    
}
export {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson,
    getCurrentSubgenreGenre,getGenreSubgenre,getCurrentAuthor,
    getAllAuthors,getPubSeries,getAllSeriesBooks,postEditBook,postImg,getNewBookPage,getDeleteBook}