import { Op, json, where } from "sequelize"
import {User, Subgenre, Genre, 
  SubgenreBook, Publishing, Series,
  Author, Book, Basket, 
  Order, Review}from "../models/model.js"
import jwt, { decode } from "jsonwebtoken"
import {verifyToken, translit,shortCut} from "../helpers/functionForServer.js"
import 'dotenv/config'
import 'fs'
import path from "path"

const getAuthorisation = (req,res)=>{
    const user = shortCut(req)
    res.status(200).render('./pages/authorisation',{title:'Авторизация',user})
  }
const postAuthorisation = async(req,res)=>{
    const userFromClient = req.body
    const responseDB = await User.findOne({
        where:{
            email:userFromClient.email,
            password:userFromClient.password,
            type:userFromClient.type
        }
    })
    if(responseDB){
        const secretWord = process.env.SECRET_WORD
        const userAuthorisation = {
            id:responseDB.get('id'),
            email:responseDB.get('email'),
            lastname:responseDB.get('lastname'),
            name:responseDB.get('name'),
            type:userFromClient.type
        }
        const token = jwt.sign(userAuthorisation, secretWord)

        res.cookie('authorisation_token',token,{httpOnly:true})
        if(responseDB.get('type')==='работник'){
            res.status(200).json({
                url:'/sotrudnik/content/get-book-list'
            })
        }
        else{
            res.status(200).json({
                url:'/'
            })
        }
    } 
    else
        res.status(403).send("There is no such user!")
}
const getDeleteCookie = (req,res)=>{
    res.status(200).clearCookie('authorisation_token')
    res.send("Выход!")
}
export{postAuthorisation,getAuthorisation,getDeleteCookie}