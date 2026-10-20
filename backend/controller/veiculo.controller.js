const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.modelo ||!valores.marca || !valores.placa || !valores.codRastreio || !valores.idCliente){
        return res.status(401).json({message: 'Todos os campos são obrigatórios!!'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: "Cliente informado é inexistente!"})
        }

        const codRastreioCripto = CryptoJS.AES.encrypt(valores.codRastreio, CHAVE_SECRETA).toString()

        await Veiculo.create({
            modelo: valores.modelo,
            marca: valores.marca,
            placa: valores.placa,
            codRastreio: codRastreioCripto,
            idCliente: valores.idCliente
        })
        
        res.status(201).json({message: 'Veiculo cadastrado com sucesso!'})
    }catch(err){
        res.status(500).json({message: 'Erro ao tentar cadastrar Veiculo'})
        console.error('Erro ao tentar cadastrar Veiculo',err)
    }
}

module.exports = { cadastrar }