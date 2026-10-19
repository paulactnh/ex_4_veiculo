const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.nome ||!valores.email || !valores.senha || !valores.cpf || !valores.endereco || !valores.telefone){
        return res.status(401).json({message: 'Todos os campos são obrigatórios!!'})
    }

    try{
        const senhaCripto = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        const cpfCripto = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCripto,
            cpf: cpfCripto,
            endereco: valores.endereco,
            telefone: valores.telefone
        })

        res.status(201).json({message: 'Cliente cadastrado com sucesso!'})
    }catch(err){
        res.status(500).json({message: 'Erro ao tentar cadastrar cliente'})
        console.error('Erro ao tentar cadastrar cliente',err)
    }
}

const listar = async(req,res)=>{
    try {
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach(el => {
            let cpfDecrypt = ''

            try {
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDecrypt = bytes.toString(CryptoJS.enc.Utf8)
            } catch (err) {
                cpfDecrypt = 'Erro ao descriptografar'
                console.error(cpfDecrypt,err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDecrypt,
                endereco: el.endereco,
                telefone: el.telefone
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        res.status(500).json({message: 'Erro ao tentar listar cliente'})
        console.error('Erro ao tentar listar cliente',err)
    }
}

const buscarPorNome = async(req,res)=>{
    const nome = req.params.nome

    try {
        const cliente = await Cliente.findOne({where: {nome: nome}})
        if(!cliente){
            return res.status(404).json({message: 'Cliente inexistente!'})
        }
        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        const cpfDecrypt = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDecrypt,
            endereco: cliente.endereco,
            telefone: cliente.telefone
        })
    } catch (err) {
        res.status(500).json({message: 'Erro ao tentar consultar o cliente por nome'})
        console.error('Erro ao tentar consultar o cliente por nome',err)
    }
}

module.exports = { cadastrar, listar, buscarPorNome }