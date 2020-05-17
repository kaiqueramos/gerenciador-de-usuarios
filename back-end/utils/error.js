/*Módulo utilitário para tratamento de erros*/

module.exports = {//Permite exportar o módulo para outros arquivos
    send: (err, req, res, code = 400) => {//Nome do módulo e parâmetros
        console.log(`Error: ${err}`)//Debug
        res.status(code).json({//O status recébe o código 400 por padrão e retorna na tela um JSON contendo o erro
            error: err//Será mostrado na tela como JSON
        })
    }
}