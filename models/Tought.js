const db = require('../db/conn')
const {DataTypes} = require('sequelize')
const User = require('./User')

const Tought = db.define('Tought', {
    tought: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})
Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought