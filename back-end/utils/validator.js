/*Módulo para validar dados*/

module.exports = {
    user: (app, req, res) => {
        req.assert('nome', 'O nome é obrigatório').notEmpty()
        //Assert é um método do validator, que espera 2 parâmetros: o nome do campo a ser validado, e a mensagem caso seja rejeitado
        //Depois, é passado o método de validação. Nesse caso, o campo não pode estar vazio.
        
        req.assert('email', 'Email inválido').notEmpty().isEmail()
        //Verifica se o campo está vazio e é email

        let errors = req.validationErrors()//Variável que guarda um array com os erros que acontecerem

        if(errors){
            //Caso aconteça algum erro, o processo é interrompido
            app.utils.error.send(errors, req, res)//Método que consegue ler e tratar erros
            return false//Interrompe o funcionamento
        }else{
            return true
        }
    }
}