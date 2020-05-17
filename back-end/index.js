const express = require('express')//Requisição do módulo do express
const consign = require('consign')//Requisição do módulo do consign
const bodyParser = require('body-parser')//Requisição do módulo interpretador das informações contidas no body da requisição
const expressValidator = require('express-validator')//Requisição do modulo de validação de dados do express

let app = express()//Invoca a função express na variável, que retorna tudo que acontece dentro dela

app.use(bodyParser.urlencoded({ extended: false}))//Usa o encriptamento de URL do body-parser ao receber os dados //PORQUE EXTENDED: FALSE?
app.use(bodyParser.json())//Recebe os dados com o formato JSON
app.use(expressValidator())//Invoca o método de validação no projeto

consign()/*Invocação do método*/.include('routes')/*Inclui a pasta em questão*/.include('utils')/*Inclui a pasta de utilidades*/.into(app)/*Dentro da variavel app*/
//Invocação do consign, passando como parametro de inclusão a pasta routes

app.listen(3000/*Porta que vai ser ouvida*/, '127.0.0.1'/*Endereço IP do servidor*/, ()=>{/*Função de callback*/
    //Método para escutar o servidor
    //Não muda nada com o uso do express

    console.log('Server OK')
})