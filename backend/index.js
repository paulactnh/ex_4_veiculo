const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')
const clienteController = require('./controller/cliente.controller')
const veiculoController = require('./controller/veiculo.controller')
const agendamentoController = require('./controller/agendamento.controller')

const hostname = 'localhost'
const PORT = 3000

//----------Middeware --------------
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

//--------- Public Rotes -------------
app.post('/cliente', clienteController.cadastrar)
// app.post('/login', authController.login)

app.get('/', (req,res)=>{
    res.status(200).json({message: 'Aplicação rodando'})
})
//--------- Private Rotes -------------
app.get('/clientes', clienteController.listar)
app.get('/cliente/buscarNome/:nome', clienteController.buscarPorNome)
app.get('/cliente/:id', clienteController.consultar)
app.delete('/cliente/:id', clienteController.apagar)
app.put('/cliente/:id', clienteController.atualizar)

app.post('/veiculo', veiculoController.cadastrar)

app.post('/agendamento', agendamentoController.cadastrar)
app.get('/agendamentos', agendamentoController.listarPorData)
app.put('/agendamento/:id', agendamentoController.atualizar)

//----------- Server ---------------
conn.sync()
.then(()=>{
    app.listen(PORT, hostname,()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro ao tentar conectar com o banco de dados!',err)
})