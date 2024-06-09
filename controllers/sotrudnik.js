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
import { title } from "process"
import { serialize } from "v8"

const getOrder = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник")
        res.status(200).render('./pages/sotrudnik/sotrudnikOrderEdit',{title:'Содержимое заказа'})
}
const getBookList = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник")
        res.status(200).render('./pages/sotrudnik/sotrudnikBookList',{title:'Книги'})
    else
        res.status(404).send("Страница не найдена!")
}
const getAllBooks = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const books = await Book.findAll()
        const author = await Author.findAll()
        const subgenreBook = await SubgenreBook.findAll()
        const subgenre = await Subgenre.findAll()
        const genre = await Genre.findAll()
        const outputBook = []
        
        author.forEach(aItem=>{
            const subgenreBookAr = []
            books.forEach(bItem=>{
                subgenreBook.forEach(sItem=>{
                    if(sItem.get('bookFk')===bItem.get('id'))
                        subgenreBookAr.push(sItem.dataValues)
                })
                const subgenreAr = []
                subgenre.forEach(subItem=>{
                    subgenreBookAr.forEach(arItem=>{
                        if(subItem.get('id')===arItem.subgenreFk)
                            subgenreAr.push(subItem.dataValues)
                    })
                })
                const buffer = {}
                if(subgenreAr.length>0)
                    genre.forEach(gItem=>{
                        if(gItem.get('id')===subgenreAr[0].genreFk){
                            buffer.genreName = gItem.get('name')
                            buffer.genreId = gItem.get('id')
                        }
                    })
                buffer.subgenre = subgenreAr
                if(aItem.dataValues.id===bItem.dataValues.authorFk){
                    outputBook.push({...aItem.dataValues, ...bItem.dataValues,...buffer})
                }
            })
        })
    
        res.status(200).json(outputBook)
    }
    else
        res.status(404).send("Страница не найдена!")

}
const getEditBook = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        res.status(200).render('./pages/sotrudnik/sotrudnikEditBook',{title:'Редактировать книгу',namePage:'Редактирование книги'})
    }
    else
        res.status(404).send("Страница не найдена!")
}
const getEditBookJson = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const idBook = req.params.id
        const book = await Book.findOne({
            where:{
                id:Number(idBook)
            }
        })
        res.status(200).json(book.dataValues)
    }
    else
        res.status(404).send("Страница не найдена!")

}
const getCurrentSubgenreGenre = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else 
        res.status(404).send("Страница не найдена!")

}
const getGenreSubgenre = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else
        res.status(404).send("Страница не найдена!")
}
const getCurrentAuthor = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else
        res.status(404).send("Страница не найдена!")

}
const getAllAuthors = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const authors = await Author.findAll()
        const authorsAr = []
        authors.forEach(item=>{
            authorsAr.push(item.dataValues)
        })
        res.status(200).json(authorsAr)
    }
    else{
        res.status(404).send("Страница не найдена!")
    }
}
const getPubSeries = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else
        res.status(404).send("Страница не найдена!")
}
const getAllSeriesBooks = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else
        res.status(404).send("Страница не найдена!")
}
const postEditBook = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else
        res.status(404).send("Страница не найдена!")
}
const postImg = (req, res) => {
    const user = shortCut(req)
    if(user.type==="работник"){
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
        }
        res.status(200).send({ message: 'File uploaded successfully.' });
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const getNewBookPage = (req, res) => {
    const user = shortCut(req)
    if(user.type==="работник")
        res.status(200).render('./pages/sotrudnik/sotrudnikEditBook',{title:'Добавление книги',namePage:'Добавление книги'})
    else
        res.status(404).send("Страница не найдена!")   
}
const getDeleteBook = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
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
    else
        res.status(404).send("Страница не найдена!")   
    
}
const getNewGenrePage = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        res.status(200).render('./pages/sotrudnik/sotrudnikEditGenre',{title:'Добавление жанра',namePage:'Добавление жанра'})
    }
    else
        res.status(404).send("Страница не найдена!")   
}
//Получение джсона для редактирования жанра
const getOneGenreManySubgenre = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const idGenre = Number(req.params.id)
        const genre = await Genre.findOne({where:{
            id:idGenre
        }})
        const subgenre = await Subgenre.findAll({where:{
            genreFk:idGenre
        }})
        const arSubGenre = []
        subgenre.forEach(item=>{
            arSubGenre.push(item.dataValues)
        })
        const buffer = {
            genre:genre.dataValues,
            listSub:arSubGenre
        }
        res.status(200).json(buffer)
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const postNewGenreSub = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const newGenreSub = req.body
        const arSubGenre = newGenreSub.listSubGenre
        const answerGenre = await Genre.create({
            name:newGenreSub.name
        })
    
        for(let i = 0; i<arSubGenre.length; i++){
            const answerSubgenre = await Subgenre.create({
                genreFk:answerGenre.get('id'),
                name:arSubGenre[i]
            })
        }
        res.status(200).send("Жанр добавлен!")
    }
    else
        res.status(404).send("Страница не найдена!")   

}
const getAllGenre = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const genre = await Genre.findAll()
        const subgenre = await Subgenre.findAll()
        const listGenre = []
        genre.forEach(gItem=>{
            const listSub = []
            subgenre.forEach(sItem=>{
                if(sItem.get('genreFk')===gItem.get('id'))
                    listSub.push(sItem.dataValues)
            })
            const buffer = {
                genre:gItem.dataValues,
                listSub:listSub
            }
            listGenre.push(buffer)
        })
        res.status(200).json(listGenre)
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const getEditGenre = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        res.status(200).render('./pages/sotrudnik/sotrudnikEditGenre',{title:'Редактирование жанра',namePage:'Редактирование жанра'})
    }
    else
        res.status(404).send("Страница не найдена!")   

}
const getAuthor = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const authors = await Author.findAll()
        const arAuthors = []
        authors.forEach(item=>{
            arAuthors.push(item.dataValues)
        })
        res.status(200).json(arAuthors)
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const getPageAuthor = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник")
        res.status(200).render('./pages/sotrudnik/sotrudnikEditAuthor',{title:'Добавление автора',namePage:'Добавление автора'})
    else
        res.status(404).send("Страница не найдена!")   
}
const postNewauthor = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const author = req.body
        const responseDB = await Author.create({
            lastname:author.lastname,
            authorName:author.authorName
        })
        if(!responseDB.isNewRecord)
            res.status(200).send('Автор добавлен!')
    }
    else
        res.status(404).send("Страница не найдена!")   

}
const getAuthorForEdit = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const authorId = Number(req.params.id)
        const author = await Author.findOne({
            where:{
                id:authorId
            }
        })
        res.status(200).json(author.dataValues)
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const postEditAuthor = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const author = req.body
        const resp = await Author.update({
            lastname:author.lastname,
            authorName:author.authorName
        },{
            where:{
                id:author.id
            }
        })
        res.status(200).send('Автор отредактирован!')
    }
    else
        res.status(404).send("Страница не найдена!")   

}
const getDeleteAuthor = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const authorId = Number(req.params.id)
        const author = await Author.destroy({
            where:{
                id:authorId
            }
        })
        res.status(200).send('Автор удален!')
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const getNewPub = (req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        res.status(200).render('./pages/sotrudnik/sotrudnikEditPublishing',{title:'Добавление издательства',namePage:'Добавление издательства'})
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const getPubSeriesConstraint = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const pub = await Publishing.findAll()
        const series = await Series.findAll()
        const listPub = []
        pub.forEach(pItem=>{
            const listSeries = []
            series.forEach(sItem=>{
                if(sItem.get('publishingFk')===pItem.get('id'))
                    listSeries.push(sItem.dataValues)
            })
            const buffer = {
                pub:pItem.dataValues,
                listSeries:listSeries
            }
            listPub.push(buffer)
        })
        res.status(200).json(listPub)
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const postNewPub = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const newPubSer = req.body
        const arSeries = newPubSer.listPubSer
        const answerPub = await Publishing.create({
            name:newPubSer.name
        })
    
        for(let i = 0; i<arSeries.length; i++){
            const answerSeries = await Series.create({
                publishingFk:answerPub.get('id'),
                name:arSeries[i]
            })
        }
        res.status(200).send("Жанр добавлен!")
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const getJsonEditPub = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const idPub = Number(req.params.id)
        const responsePublish = await Publishing.findOne({
            where:{
                id:idPub
            }
        })
        const responseSeries = await Series.findAll({
            where:{
                publishingFk:idPub
            }
        })
        const resAr = []
        responseSeries.forEach(item=>{
            resAr.push(item.get('name'))
        })
        const buffer = {
            pub:responsePublish.get('name'),
            listSeries:resAr
        }
        res.status(200).json(buffer)  
    }
    else
        res.status(404).send("Страница не найдена!")   
}
const postEditPub = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const save = req.body
        const idPub = Number(req.params.id)
        const pub = save.name
        const listSer = save.listPubSer
        const responsePub = await Publishing.update({
            name:pub
        },{
            where:{
                id:idPub
            }
        })
        await Series.destroy({
            where:{
                publishingFk:idPub
        }})
        for(let i=0; i<listSer.length; i++){
            await Series.create({
                name: listSer[i],
                publishingFk:idPub
            })
        }
        res.status(200).send("Издание отредактировано!")   

    }
    else
        res.status(404).send("Страница не найдена!")   

}
const postEditGenre = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const idGenre = Number(req.params.id)
        const body = req.body
        console.log(body)
        const respGenre = await Genre.update({
            name:body.name
        },{
            where:{
                id:idGenre
            }
        })
        const resDel = await Subgenre.destroy({
            where:{
                genreFk:idGenre
            }
        })
        const listSub = body.listSubGenre
        for(let i=0; i<listSub.length; i++){
            
            const respSubawait = await Subgenre.create({
                name:listSub[i],
                genreFk:idGenre
            })
        }
        
        res.status(200).send("Жанр отредактирован!")   

    }
    else
        res.status(404).send("Страница не найдена!")   
}
const delGenre = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const idGenre = Number(req.params.id)
        await Subgenre.destroy({
            where:{
                genreFk:idGenre
            }
        })
        await Genre.destroy({
            where:{
                id:idGenre
            }
        })
        res.status(200).send("Жанр удален!")   
    }
    else
        res.status(404).send("Страница не найдена!")   

}
const delPub = async(req,res)=>{
    const user = shortCut(req)
    if(user.type==="работник"){
        const idPub = Number(req.params.id)
        await Series.destroy({
            where:{
                publishingFk:idPub
            }
        })
        await Publishing.destroy({
            where:{
                id:idPub
            }
        })
        res.status(200).send("Издательство удалено!")
    }
    else
        res.status(404).send("Страница не найдена!")
}
export {getAllBooks,getOrder, getBookList,getEditBook,getEditBookJson,
    getCurrentSubgenreGenre,getGenreSubgenre,getCurrentAuthor,
    getAllAuthors,getPubSeries,getAllSeriesBooks,postEditBook,
    postImg,getNewBookPage,getDeleteBook,getNewGenrePage,
    getOneGenreManySubgenre,postNewGenreSub,getAllGenre,
    getEditGenre,getAuthor,getPageAuthor,postNewauthor,
    getAuthorForEdit,postEditAuthor,getDeleteAuthor,getNewPub,
    getPubSeriesConstraint,postNewPub,getJsonEditPub,postEditPub,postEditGenre,delGenre,delPub}