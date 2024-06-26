import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series,
  Author, Book, Basket, 
  Order, Review,OrderElements}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit, shortCut,convertDate} from "../helpers/functionForServer.js"
import 'dotenv/config'
import 'fs'
import path from "path"
//Путь к папке с изображениями
const __dirname = path.resolve()
const imageDirectory = path.join(__dirname,'nomenclature')
const getIndex = (req,res) =>{
  const user = shortCut(req)
  res.render("./pages/index",{title:"Новинки",user})
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
  const user = shortCut(req)
  const idBook = req.params.bookId
  const book = await Book.findOne({
    where:Number(idBook)
  })
  res.status(200).render('./pages/book',{title:book.name,user})
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

  //Склеиваем объект книги с объектов озывов и пользователей
  const generalInfoBook = {...book.dataValues, ...bufferForReview}
  res.status(200).json(generalInfoBook)
}
const getSearch = (req,res) =>{
  const user = shortCut(req)
  res.status(200).render('./pages/search',{title:'Результаты поиска',user})
}
const getBasket = (req,res)=>{
  const user = shortCut(req)
  res.status(200).render('./pages/basket',{title:'Корзина',user})
}
const getPlacingOrder = (req,res)=>{
  const user = shortCut(req)
  res.status(200).render('./pages/placingAnOrder',{title:'Оформление заказа',user})
}
const getPayForm = (req,res) => {
  res.status(200).render('./pages/formBuy',{title:'Оплата заказа'})
}
const getRegistration = (req,res)=>{
  const user = shortCut(req)
  res.status(200).render('./pages/registration',{title:'Регистрация',user})
}
const getListOrder  = (req,res)=>{
  const user = shortCut(req)
  res.status(200).render('./pages/listOrder',{title:'Заказы',user})
}


const getShortcut = (req,res)=>{
  res.status(200).render('./pages/hotkey(TEST!!!)/shorcutCLIENTPage')
}
const postAddInBasket = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    const book = req.body 
    await Basket.create({
      userFk:user.id,
      bookFk:book.id,
      count:1
    })
    res.status(200).send("Книга добавлена в корзину")
  }
  else
    res.status(404).send("Нету")
}
const getBasketUserList = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    const bookList = await Book.findAll()
      const basketList = await Basket.findAll({
          where:{
              userFk:user.id
          }
      })
      const arBasketList = []
      const author = await Author.findAll()
      bookList.forEach(bookItem=>{
        basketList.forEach(basketItem=>{
          author.forEach(aItem=>{
            if(bookItem.get('id')===basketItem.get('bookFk')&&aItem.get('id')===bookItem.get('authorFk')){
              const buffer = {
                  book:bookItem.dataValues,
                  count:basketItem.get('count'),
                  author:aItem.dataValues
              }
              arBasketList.push(buffer)
            }
          })
         
      })
      })

      if(arBasketList.length>0)
        res.status(200).json(arBasketList)
      else
        res.status(201).send("нету")
  }
  else
    res.status(500).send("нету")
}
const getDeleteBasketItem = async(req,res)=>{
  const user = shortCut(req)
  const bookId = req.params.id
  if(typeof user==="object"){
    const responseDB = await Basket.destroy({
      where:{
        userFk:user.id,
        bookFk:Number(bookId)
      }
    })
    res.status(200).send("Запись удалена!")
  }
}
const getBookForSubgenre = (req,res)=>{
  const user = shortCut(req)
  res.status(200).render('./pages/subgenreChoose',{title:'Заказы',user})

}
const getBookFromSub = async(req,res)=>{
  const idSub = req.params.id
  const responseSub1 = await Subgenre.findByPk(Number(idSub))
  const responseSub = await SubgenreBook.findAll({
    where:{
      subgenreFk:Number(idSub)
    }
  })
  const responseBook = await Book.findAll()
  const arAnswer = []
  const author = await Author.findAll()


  author.forEach(aItem=>{
    responseSub.forEach(sItem=>{
      responseBook.forEach(bItem=>{
        if(sItem.get('bookFk')===bItem.get('id')&&aItem.get('id')===bItem.get('authorFk')){
          arAnswer.push({...bItem.dataValues , ...{lastname:aItem.get('lastname'),authorName:aItem.get('authorName')}})
        }
      })
    })
  })
  
  res.status(200).json({bookList:arAnswer,namePage:responseSub1})

}
const postSaveReviewBuyer = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    const body = req.body
    
    console.log(req.body)
    await Review.create({
      bookFk:body.idBook,
      userFk:user.id,
      generalReview:body.generalReview,
      disReview:body.disReview,
      advReview:body.advReview,
      status:'ожидание'
    })
    res.status(200).send("ok")

  }
  else
    res.status(404).send("нету")

}
const getSearchJSON = async(req,res)=>{
  const search = req.params.search
  const books = await Book.findAll()
 const author = await Author.findAll()
 const outputBook = []

 author.forEach(aItem=>{
    books.forEach(bItem=>{
      if(aItem.dataValues.id===bItem.dataValues.authorFk)
        outputBook.push({...aItem.dataValues, ...bItem.dataValues})
    })    
 })
 const endAr = [] 
 outputBook.forEach(item=>{
  if(item.name.includes(search)||item.authorName.includes(search)||item.lastname.includes(search)){
    endAr.push(item)
  }
 })
 res.status(200).json(endAr)

  //const responseAuthor
}
const postSavePlaceOrder = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    const body = req.body
    console.log(body)
    const responseOrder = await Order.create({
      addres:body.addres,
      orderDate:new Date(),
      status:'в обработке',
      userFk:user.id,
      typeBuy:body.typeBuy,
      price:Number(body.price)

    })
    console.log(responseOrder)
    const responseBasket = await Basket.findAll({
      where:{
        userFk:user.id
      }
    })
    const allBook = await Book.findAll()
    for(let i=0; i<responseBasket.length; i++){
      for(let j=0; j<allBook.length; j++){
        if(responseBasket[i].get('bookFk')===allBook[j].get('id')){
          await OrderElements.create({
            bookFk:allBook[j].get('id'),
            orderFk:responseOrder.get('id'),
            count:responseBasket[i].get('count')
          })

        }
      }
    }
    await Basket.destroy({
      where:{
        userFk:user.id
      }
    })
    res.status(200).send('Заказ добавлен!')
  }
  else{
    res.status(404).send("Нету")
  }
}
const getListOrderJSON = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    const responseDBOrder = await Order.findAll({
      where:{
        userFk:user.id
      }
    })

    const orderSAr = []
    const responseDBOrderEl = await OrderElements.findAll()
      for(let j=0; j<responseDBOrder.length; j++){
        const orderAr = []
        for(let i=0; i<responseDBOrderEl.length; i++){        
          if(responseDBOrder[j].get('id')===responseDBOrderEl[i].get('orderFk')){
            const responseDBBook = await Book.findByPk(responseDBOrderEl[i].get('bookFk'))
            const buffer = {
             
              book:responseDBBook.dataValues,
              count:responseDBOrderEl[i].get('count')
            }
            orderAr.push(buffer)
          }
      }
      const dateBuf = convertDate(new Date(responseDBOrder[j].get('dateIssue')))!=="1970-01-01 00:00:00"?convertDate(new Date(responseDBOrder[j].get('dateIssue'))):"-"
      const buffer2 = {
        price:responseDBOrder[j].get('price'),
        status:responseDBOrder[j].get('status'),
        addres:responseDBOrder[j].get('addres'),
        typeBuy:responseDBOrder[j].get('typeBuy'),
        dateIssue:dateBuf,
        orderDate:convertDate(new Date(responseDBOrder[j].get('orderDate'))),
        idOrder:responseDBOrder[j].get('id'),
        books:orderAr
      }
      orderSAr.push(buffer2)
    }
    if(orderSAr.length>0)
      res.status(200).json(orderSAr)
    else
      res.status(201).send("не")

  }
  else{
    res.status(200).render('./pages/authorisation',{title:'Авторизация',user})
  }
}
const getCancelOrder = async (req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    await Order.update({
      status:'отменен'
    },{
      where:{
        userFk:Number(user.id)
      }
    })
    res.status(200).send('Заказ отменен!')
  }
  else
    res.status(200).render('./pages/authorisation',{title:'Авторизация',user})

}
const getEmptyBasket = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    res.status(200).render('./pages/emptyBasket',{title:'Корзина',user})
  }
  else{
    res.status(200).render('./pages/authorisation',{title:'Авторизация',user})
  }
}
const getEmptyOrder = async(req,res)=>{
  const user = shortCut(req)
  if(typeof user==="object"){
    res.status(200).render('./pages/emptyOrderList',{title:'Список заказов',user})
  }
  else{
    res.status(200).render('./pages/authorisation',{title:'Авторизация',user})
  }

}
const getPubSerAll = async(req,res)=>{
  const pub = await Publishing.findAll()
  const ser = await Series.findAll()
  const outputAr = []
  pub.forEach(pItem=>{
    const arSer = []
    ser.forEach(sItem=>{
      if(pItem.get('id')===sItem.get('publishingFk'))
        arSer.push(sItem.dataValues)
    })
    const buffer = {
      pub:pItem.dataValues,
      ser:arSer
    }
    outputAr.push(buffer)

  })
  res.status(200).json(outputAr)
}
export {getIndex, getGenre, getSubgenre, getNewBookRow, 
  getImage, getBookPage, getBookJson,getSearch,
  getBasket,getPlacingOrder,getPayForm,
  getRegistration,
  getListOrder,getShortcut,postAddInBasket,
  getBasketUserList,getDeleteBasketItem,
  getBookForSubgenre,getBookFromSub,postSaveReviewBuyer,getSearchJSON,
  postSavePlaceOrder,getListOrderJSON,getCancelOrder,getEmptyBasket,getEmptyOrder,getPubSerAll}
//выдача токена
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})
