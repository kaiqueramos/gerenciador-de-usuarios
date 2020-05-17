class User{
    constructor(name, gender, birth, country, email, password, photo, admin){
        this._id
        this._name = name 
        this._gender = gender 
        this._birth = birth 
        this._country = country 
        this._email = email 
        this._password = password 
        this._photo = photo 
        this._admin = admin
        this._register = new Date()
    }
    get id(){
        return this._id
    }
    get register(){
        return this._register
    }
    get name(){
        return this._name
    }
    get gender(){
        return this._gender
    }
    get birth(){
        return this._birth
    }
    get country(){
        return this._country
    }
    get email(){
        return this._email
    }
    get password(){
        return this._password
    }
    get photo(){
        return this._photo
    }
    get admin(){
        return this._admin
    }
    set photo(value){
        this._photo = value
    }
    loadFromJSON(json){
        for(let name in json){
            
            switch(name){
                case '_register':
                    this[name] = new Date(json[name])
                break
            
            default:
                this[name] = json[name]
            }
        }

    }
    static getUsersStorage(){
        let users = []

        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"))
        }
        return users
    }//End getUsersStorage
    getNewId(){

        let userID = parseInt(localStorage.getItem('userID'/*Nome do item no localStorage*/)/*O localStorage entende apenas strings*/)
        
        if(!userID > 0){//O userId guardado no localStorage não é maior que 0? Caso aconteça, ele não existe

            userID = 0 //userID vai receber 0, pois ele vai passar a existir
        }

        //Caso exista ou não um userID no localStorage, a linha abaixo será executada

        userID++//Adiciono +1 ao userID

        localStorage.setItem('userID', userID)//Guardo o valor de userID na chave de mesmo nome, no localStorage

        return userID//O método retorna userID para ser acessado por outras fontes
    }
    save(){
        let users = User.getUsersStorage()

        if(this.id > 0){

            users.map(u => {
                if(u._id == this.id){

                    Object.assign(u, this)
                }
                
                return u
            })
        }else{
            this._id = this.getNewId()

            users.push(this)

        }

        localStorage.setItem("users", JSON.stringify(users))
        


    }
    remove(){//Remove um usuário no localStorage

        let users = User.getUsersStorage()//Atribui a uma variável todo o array de dados contido no localStorage

        users.forEach((userData /*Dados do usuário dentro de cada indice*/, index/*Índice desses dados*/) => {
            //ForEach para percorrer o array guardado no localStorage, para encontrar o ID e atribuir uma exclusão

            if(this._id == userData._id){//O id que estou carregando é o mesmo que está nesse índice _id do localStorage?
                users.splice(index/*índice que vai ser removido, baseando no parâmetro que carrega os índices no forEach*/, 
                            1/*Quantidade de índices que váo ser removidos*/)
            //Splice espara 2 parâmetros: o índice que vai ser removido, e quantos itens a partir do índice vai ser removido. Chamo ele direto do objeto user, pois é dele que quero remover
            }
        })
        localStorage.setItem("users", JSON.stringify(users))//Guarda denovo as informações do users no localStorage, assim que o forEach acabar
    }
}