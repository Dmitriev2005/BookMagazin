import { json } from "sequelize"
import {User, Subgenre, Genre, 
  GenreSubgenre, Publishing, Series, Discount, 
  Author, AuthorBook, Book, Basket, 
  UserOrder, SeriesBook, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken} from "../helpers/functions.js"

export const getIndex = (req,res) =>{
  
  res.render("./pages/index",{title:"Home"})
}
// const token = jwt.sign(userAuthourisation,secretWord,{expiresIn:"1h"})
// res.cookie('authorisation_token',token,{httpOnly:true})