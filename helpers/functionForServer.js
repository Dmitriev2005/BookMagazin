import jwt, { decode } from "jsonwebtoken"
import multer from "multer"
import 'dotenv/config'
//Проверка токена
const verifyToken = (req) =>{ 
    let returnVerf = 403
    if("authorisation_token" in req.cookies){
      
      const tokenClient = req.cookies.authorisation_token
      if(tokenClient)
        jwt.verify(tokenClient,process.env.SECRET_WORD,(err,decoded)=>{
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
//Шоркат на проверку и вывод No authorisation если нет пользователя
const shortCut = (req)=>{
	const buffer = verifyToken(req)
	let user
	if(buffer===403)
	  user = 403
	else if(!buffer)
	  user = "Пользователь не авторизирован"
	else 
	  user = buffer
	
	return user
  }
//Преобразование кирилицы в латиницу
const translit = (word) =>{
  let converter = {
		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
		'э': 'e',    'ю': 'yu',   'я': 'ya'
	}
 
	word = String(word).toLowerCase() 
  
	let answer = ''
	for (let i = 0; i < word.length; ++i ) {
		if (converter[word[i]] == undefined){
			answer += word[i]
		} else {
			answer += converter[word[i]]
		}
	}
 
	answer = answer.replace(/[^-0-9a-z]/g, '-')
	answer = answer.replace(/[-]+/g, '-')
	answer = answer.replace(/^\-|-$/g, '') 
	return answer
}
//Загрузить изображение на сервер
const storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'nomenclature/')
	},
	filename:function(req,file,cb){
		cb(null,req.params.id+'.jpg')
	}
})

const upload = multer({storage:storage})
const uplaodS = upload.single('file')
export {verifyToken, translit,uplaodS,shortCut}