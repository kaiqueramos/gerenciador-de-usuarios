/**
 * Rota de acesso padrão do app
 */

module.exports = app => { //Com o consign, já passo o module.exports recebendo como resposta o callback de acesso as rotas
    app.get('/'/*Rota que vai ser usada*/, (req/*Requisições feitas ao servidor*/, res/*Resposta do servido*/) =>{
        //Acesso direto ao método get com o express, que espera os parâmetros: rota usada e callback com parâmetros: requisições e resposta
        //Com o express, não preciso tratar os dados de rotas com uma condicional
    
        res.statusCode = 200 //Retorna para o servidor um código de status. 200 significa sucesso
    
        res.setHeader('Content-Type'/*Se espera um conteúdo*/, 'text/html'/*do tipo HTML*/)
        //Adiciona informações de cabeçalho, para o servidor definir como o conteúdo será lido
    
        res.end('<h1>Olá</h1>')
        //Retorna esse HTML na tela
    
    })
}