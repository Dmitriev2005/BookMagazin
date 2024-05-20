import { Sequelize, DataTypes } from 'sequelize'
import 'dotenv/config'
const db = new Sequelize(process.env.DATABASE,process.env.USER,process.env.PASSWORD,{
  dialect:process.env.DIALECT,
  host:process.env.HOST,
  define:{
    freezeTableName:true,
    timestamps:false
  }
})
const User = db.define('user',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    field:'id'
  },
  name:{
    field:'user_name',
    type:DataTypes.STRING
  },
  lastname:{
    field:'user_lastname',
    type:DataTypes.STRING
  },
  type:{
    field:'user_type',
    type:DataTypes.ENUM('администратор','работник','клиент')
  },
  email:{
    field:'email',
    type:DataTypes.STRING,
  },
  password:{
    field:'user_password',
    type:DataTypes.STRING
  }
})
const Genre = db.define('genre',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    field:'genre_name',
    type:DataTypes.STRING,
    allowNull:false
  }
})
const Subgenre = db.define('subgenre',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  genreFk:{
    field:'genre_fk',
    type:DataTypes.INTEGER
  },
  name:{
    field:'subgenre_name',
    type:DataTypes.STRING,
    allowNull:false
  }
})
const SubgenreBook = db.define('genre_subgenre',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  genreFk:{
    field:'genre_fk',
    type:DataTypes.INTEGER
  },
  bookFk:{
    field:'book_fk',
    type:DataTypes.INTEGER
  }
})
const Publishing = db.define('publishing',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  name:{
    field:'publishing_name',
    type:DataTypes.STRING
  },
  discountFk:{
    field:'discount_fk',
    type:DataTypes.INTEGER
  }
})
const Series = db.define('series',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  name:{
    field:'series_name',
    type:DataTypes.STRING
  },
  publishingFk:{
    field:'publishing_fk',
    type:DataTypes.INTEGER
  },
  discountFk:{
    field:'discount_fk',
    type:DataTypes.INTEGER
  }
})
const Discount = db.define('discount',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  quantity:{
    field:'discount_quantity',
    type:DataTypes.INTEGER
  },
  dateStart:{
    field:'date_start',
    type:DataTypes.DATE
  },
  dateStop:{
    field:'data_stop',
    type:DataTypes.DATE
  }
})
const Author = db.define('author',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  lastname:{
    field:'lastname',
    type:DataTypes.STRING
  },
  authorName:{
    field:'author_name',
    type:DataTypes.STRING
  },
  surname:{
    field:'surname',
    type:DataTypes.STRING
  }
})
const AuthorBook = db.define('author_book',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  authorFk:{
    field:'author_fk',
    type:DataTypes.INTEGER
  },
  bookFk:{
    field:'book_fk',
    type:DataTypes.INTEGER
  }
})
const Book = db.define('book',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  name:{
    field:'book_name',
    type:DataTypes.STRING
  },
  price:{
    field:'price',
    type:DataTypes.INTEGER
  },
  discountFk:{
    field:'discount_fk',
    type:DataTypes.INTEGER
  },
  publishingFk:{
    field:'publishing_fk',
    type:DataTypes.INTEGER
  },
  yearPublishing:{
    field:'year_publishing',
    type:DataTypes.INTEGER
  },
  isbn:{
    field:'isbn',
    type:DataTypes.STRING
  },
  countPages:{
    field:'count_pages',
    type:DataTypes.INTEGER
  },
  height:{
    field:'height',
    type:DataTypes.FLOAT
  },
  width:{
    field:'width',
    type:DataTypes.FLOAT
  },
  bookLength:{
    field:'book_length',
    type:DataTypes.FLOAT
  },
  coverType:{
    field:'cover_type',
    type:DataTypes.ENUM('мягкий переплёт','твердый переплет')
  },
  count:{
    field:'count',
    type:DataTypes.INTEGER
  },
  weigth:{
    field:'weigth',
    type:DataTypes.INTEGER
  },
  ageRestrictions:{
    field:'age_restrictions',
    type:DataTypes.ENUM('не задано','18+','16+','12+','6+')
  },
  dataAdd:{
    field:'data_add',
    type:DataTypes.DATE
  },
  userWhoAdd:{
    field:'user_who_add_fk',
    type:DataTypes.INTEGER
  },
  discription:{
    field:'discription',
    type:DataTypes.STRING
  }
})
const Basket = db.define('basket',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  userFk:{
    field:'user_fk',
    type:DataTypes.INTEGER
  },
  bookFk:{
    field:'book_fk',
    type:DataTypes.INTEGER
  },
  count:{
    field:'count',
    type:DataTypes.INTEGER
  },
})
const UserOrder = db.define('user_order',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  basketFk:{
    field:'basket_fk',
    type:DataTypes.INTEGER
  },
  addres:{
    field:'addres',
    type:DataTypes.STRING
  },
  orderDate:{
    field:'order_date',
    type:DataTypes.DATEONLY
  },
  dateIssue:{
    field:'date_issue',
    type:DataTypes.DATEONLY
  },
  orderStatus:{
    field:'order_status',
    type:DataTypes.ENUM('в пути','доставлен','отменен')
  }
})
const SeriesBook = db.define('series_book',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  seriesFk:{
    field:'series_fk',
    type:DataTypes.INTEGER
  },
  bookFk:{
    field:'book_fk',
    type:DataTypes.INTEGER
  }
})
const Review = db.define('review',{
  id:{
    field:'id',
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  generalReview:{
    field:'general_review',
    type:DataTypes.STRING
  }, 
  disReview:{
    field:'dis_review',
    type:DataTypes.STRING
  },
  advReview:{
    field:'adv_review',
    type:DataTypes.STRING
  },
  bookFk:{
    field:'book_fk',
    type:DataTypes.INTEGER
  },
  userFk:{
    field:'user_fk',
    type:DataTypes.INTEGER
  }
})

export {User, Subgenre, Genre, SubgenreBook, Publishing, Series, Discount, Author, AuthorBook, Book, Basket, UserOrder, SeriesBook, Review}
