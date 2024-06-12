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
function generatePassword(length) {
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lowercase = 'abcdefghijklmnopqrstuvwxyz';
	const digits = '0123456789';
	const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
	
	// Объединяем все символы в одну строку
	const allChars = uppercase + lowercase + digits + specialChars;
  
	// Функция для случайного выбора символа из строки
	function getRandomChar(str) {
	  const randomIndex = Math.floor(Math.random() * str.length);
	  return str[randomIndex];
	}
  
	// Генерируем пароль
	let password = '';
	for (let i = 0; i < length; i++) {
	  password += getRandomChar(allChars);
	}
  
	return password;
}
const convertDate = (date)=>{
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы начинаются с 0
	const day = String(date.getDate()).padStart(2, '0');

	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const upload = multer({storage:storage})
const uplaodS = upload.single('file')
export {verifyToken, translit,uplaodS,shortCut,generatePassword,convertDate}