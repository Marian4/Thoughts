const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('toughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try{
    sequelize.authenticate()
    console.log("Aplicação conectada ao banco de dados com sucesso")
}catch(err){
    console.log('Não foi possível conectar ao banco', err)
}

module.exports = sequelize