const Agendamento = require('../models/Agendamento')
const Cliente = require('../models/Cliente')
const Veiculo = require('../models/Veiculo')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.data ||!valores.tipo || !valores.idVeiculo || !valores.idCliente){
        return res.status(401).json({message: 'Todos os campos são obrigatórios!!'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: "Cliente informado é inexistente!"})
        }

        const veiculo = await Veiculo.findByPk(valores.idVeiculo)
        if(!veiculo){
            return res.status(404).json({message: "Veiculo informado é inexistente!"})
        }

        await Agendamento.create(valores)
        res.status(201).json({message: 'Agendamento cadastrado com sucesso!'})
    }catch(err){
        res.status(500).json({message: 'Erro ao tentar cadastrar Agendamento'})
        console.error('Erro ao tentar cadastrar Agendamento',err)
    }
}

const listarPorData = async(req,res)=>{
    try {
        const agendamentos = await Agendamento.findAll({
            order: [['data', 'ASC']],
            include: [
                {
                    model: Cliente,
                    as: 'clienteAgendamento',
                    attributes: ['codCliente', 'nome', 'email', 'telefone']
                },
                {
                    model: Veiculo,
                    as: 'veiculoAgendamento',
                    attributes: ['codVeiculo', 'modelo', 'marca', 'placa']
                }
            ]
        })
        res.status(200).json(agendamentos)

    } catch (err) {
        res.status(500).json({message: 'Erro ao tentar listar Agendamentos'})
        console.error('Erro ao tentar listar Agendamentos',err)
    }
}

const atualizar = async(req,res)=>{
    const valores = req.body
    const id = req.params.id

    if(!valores.data ||!valores.tipo || !valores.idVeiculo || !valores.idCliente){
        return res.status(401).json({message: 'Todos os campos são obrigatórios!!'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: "Cliente informado é inexistente!"})
        }

        const veiculo = await Veiculo.findByPk(valores.idVeiculo)
        if(!veiculo){
            return res.status(404).json({message: "Veiculo informado é inexistente!"})
        }

        const agendamento = await Agendamento.findByPk(id)
        if(!agendamento){
            return res.status(404).json({message: "Agendamento informado é inexistente!"})
        }

        await Agendamento.update(valores, {where:{codAgendamento: id}})
        res.status(200).json({message: 'Agendamento atualizado com sucesso!'})
    }catch(err){
        res.status(500).json({message: 'Erro ao tentar atualizar Agendamento'})
        console.error('Erro ao tentar atualizar Agendamento',err)
    }
}

module.exports = { cadastrar, listarPorData, atualizar }