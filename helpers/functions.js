import jwt, { decode } from "jsonwebtoken"

//Проверка токена
const verifyToken = (req) =>{ 
    let returnVerf = 403
    if("authorisation_token" in req.cookies){
      
      const tokenClient = req.cookies.authorisation_token
      if(tokenClient)
        jwt.verify(tokenClient,secretWord,(err,decoded)=>{
          if(err)
            returnVerf = 403
          else
            returnVerf =  decoded
        })
      return returnVerf
    }
    else
      return false
}

export {verifyToken}