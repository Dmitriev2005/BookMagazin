import { Sequelize, DataTypes } from "sequelize"


const db = new Sequelize("book_magazin","root","",{
  dialect:"mysql",
  host:"localhost",
  define:{
    freezeTableName:true
  }
})
const UserTable = db.define("user",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    field:"id"
  },
  name:{
    type:DataTypes.STRING,
    field:"user_name"
  },
  lastname:{
    type:DataTypes.STRING,
    field:"user_lastname"
  },
  type:{
    type:DataTypes.ENUM("администратор","работник","клиент"),
    field:"user_type"
  },
  email:{
    type:DataTypes.STRING,
    field:"email"
  },
  password:{
    type:DataTypes.STRING,
    field:"user_password"
  }
}, {timestamps:false})
const Genre = db.define("genre",{
  
  ,{timestamps:false}
})
const TaskTable = db.define("task",{
    id_task:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title_task:{
        type:DataTypes.STRING
    },
    describe_task:{
        type:DataTypes.STRING
    },
    data_add_task:{
        type:DataTypes.DATE
    },
    data_completion_task:{
        type:DataTypes.DATE
    },
    user_fk_id_task :{
        type:DataTypes.INTEGER,
        references:{
          model:'user',
          key:'id_user'
        }
    }
},{timestamps:false})
TaskTable.associations = (model) =>{
  TaskTable.belongsTo(model.User,{
    foreignKey:'user_fk_id_task',
    onDelete:'CASCADE'
  })
}
export {UserTable,TaskTable}
