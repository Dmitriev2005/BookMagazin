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

export {verifyToken, translit}