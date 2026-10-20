const db = require('../db/conn')
const { DataTypes } = require('sequelize')
const Cliente = db.define('cliente',{
    codCliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING(40),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(40),
        allowNull: false
    },
    senha:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cpf:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    endereco:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefone:{
        type: DataTypes.STRING(40),
        allowNull: false
    }
},{
    timestamps: false,
    tableName: 'clientes'
})

module.exports = Cliente