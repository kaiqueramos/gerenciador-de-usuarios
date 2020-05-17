/**
 * Rota para caminho /users
 */
let NeDB = require('nedb')//Requisição ao módulo de banco de dados

let db = new NeDB({//Nova instância do banco de dados com parâmetros específicos.
    //Usa-se uma instância pois é possível ter vários banco de dados na aplicação

    filename: 'users.db', //Nome do arquivo contendo o banco de dados
    autoload: true, //Caso o arquivo acima não exista, o node vai criá-lo automaticamente
})
module.exports = app =>{ //Com o consign, já passo o module.exports recebendo como resposta o callback de acesso as rotas
     //Exportar a variável routes para acessá-la no arquivo principal
    
    let routes = app.route('/users')//Variável contendo a rota /users, para encurtar o código
    
    routes.get((req/*Requisições*/, res/*Respostas*/) =>{
        //Acesso direto ao método get com o express, que espera os parâmetros: rota usada e callback com parâmetros: requisições e resposta
        //Com o express, não preciso tratar os dados de rotas com uma condicional
        
        db.find({})/*Sem passar nenhum parâmetro, lista todos os usuários*/
        .sort({nome:1})/*Ordena os usuários de forma crescente (por causa do 1) baseados no nome*/
        .exec((err/*Erros*/, users/*A própria informação*/) => {/*Executa a listagem com uma função callback baseado nos parâmetros*/
            //Método usado para listar dados do banco de dados

            if(err){
                app.utils.error.send(err, req, res)//Requisição do módulo de tratamento de erros na pasta utils
            }else{
                res.statusCode = 200 //Retorna para o servidor um código de status. 200 significa sucesso
    
                res.setHeader('Content-Type'/*Se espera um conteúdo*/, 'application/json'/*do tipo JSON*/)
                //Adiciona informações de cabeçalho, para o servidor definir como o conteúdo será lido
            
                res.json({//Não precisa usar o JSON.stringfy, o express já faz a conversão usando o método .json
                          //Acesso direto ao DB retornando o valor contido no JSON users
                    users            
                })
            }
        })
    })
    routes.post((req, res) => {//Faz a requisição do tipo POST ao servidor

        if(!app.utils.validator.user(app, req, res)){//Caso o módulo de validação retornar false, esse módulo para a execução
            return false
        }

        db.insert(req.body/*Corpo da requisição, que vai ser armazenado*/, (err/*Parâmetro de erro*/, user/*Parâmetro dos dados do usuário*/) => {
            //Faz a inserção dos dados no banco de dados

            if(err){//Caso haja um retorno de erro
                app.utils.error.send(err, req, res)//Requisição do módulo de tratamento de erros na pasta utils
            }else{
                res.status(200).json(user)
            }
        })
    })

    let routeId = app.route('/users/:id')//Variável contendo a rota /users e o parâmetro ID para pesquisar o usuário baseado no ID
    
    routeId.get((req, res) => {//Requisição do tipo GET
        db.findOne({_id:req.params.id})/*Método para encontrar apenas 1 registro no db*/.exec((err, user) => {
        //Esse método espera um parâmetro que é um objeto, que vai buscar o _id no database, e dentro da requisição vai ler o id do método params

            if(err){
                app.utils.error.send(err, req, res)
            }else{
                res.status(200).json(user)
            }
        })
    })

    routeId.put((req, res) => {//Requisição do tipo PUT para edição

        if(!app.utils.validator.user(app, req, res)){//Caso o módulo de validação retornar false, esse módulo para a execução
            return false
        }

        db.update({_id:req.params.id}, req.body/*Método para editar registros no db*/, err => {
        //Esse método espera 3 parâmetros, primeiro o filtro, depois os dados a serem atualizados, que no caso estão no corpo da requisição, e por ultimo, o erro com uma função callback
        //Esse método não espera um outro método .exec

            if(err){
                app.utils.error.send(err, req, res)
            }else{
                res.status(200).json(Object.assign(req.params, req.body)) //Como não há um parâmetro users, vou retornar uma mescla dos parâmetros da requisição, que contem o ID, com o corpo da requisição. Isso será exibido no postman
            }
        })
    })
    routeId.delete((req, res) => {//Requisição do tipo DELETE para deletar informação no NeDB
        db.remove({_id:req.params.id}/*Filtro para busca*/, {}/*Se passado vazio, exclui apenas um registro*/, err => /*Callback para tratamento de erro*/{
            //Esse método remove registros no NeDB
            
            if(err){
                app.utils.error.send(err, req, res)
            }else{
                res.status(200).json(req.params) //Exibe qual foi o ID excluído
            }
        })
    })
}