import { json } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series, Discount, 
  Author, AuthorBook, Book, Basket, 
  UserOrder, SeriesBook, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken} from "../helpers/functions.js"

export const getIndex = (req,res) =>{
  
  res.render("./pages/index",{title:"Home"})
}

export const getGenre = async(req,res) =>{
  const answer = await Genre.findAll()
  const answerAr = []
   await answer.forEach(item=>{
    answerAr.push(item.dataValues)
  })

  console.log(answerAr)
  res.status(200).json(answerAr)
}
export const getSubgenre = async(req,res) =>{
  const answer = await Genre.findOne()
  console.log(answer)
  res.render("./pages/index",{title:"Home"})
}
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})