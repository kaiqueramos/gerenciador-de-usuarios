class UserController{
    constructor(formId, formIdUpdate, tableId){
        this.formEl = document.getElementById(formId)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)
        this.spread = [...this.formEl.elements]
        this.btn = this.formEl.querySelector('[type=submit]')
        
        this.onEdit()
        this.onSubmit()
        this.selectAll()
    }//End constructor
    onEdit(){

        document.querySelector('#eventCancel').addEventListener('click', e => {

            document.querySelector('#create-user-box').style.display = ''
            document.querySelector('#edit-user-box').style.display = 'none'
        })
            
        this.formUpdateEl.addEventListener('submit', event => {

            event.preventDefault()

            let btn = this.formUpdateEl.querySelector('[type=submit]')

            btn.disabled = true

            let values = this.getValues(this.formUpdateEl)
            
            let index = this.formUpdateEl.dataset.trIndex

            let tr = this.tableEl.rows[index]

            let userOld = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, userOld, values)

                       

            this.getPhoto(this.formUpdateEl).then(

                (content)=>{

                    if(!values.photo){
                    result._photo = userOld._photo
                    }else{
                        result._photo = content
                    }
                    let user = new User()

                    user.loadFromJSON(result)

                    user.save()

                    tr = this.getTr(user, tr)

                    this.updateCount() 
    
                    this.formUpdateEl.reset()
    
                    btn.disabled = false

                    document.querySelector('#create-user-box').style.display = ''
                    document.querySelector('#edit-user-box').style.display = 'none'
                    
                },
                (e)=>{
    
                    console.error(e)
    
                })
                

        })
        
    }//End of onEdit
    onSubmit(){
        this.formEl.addEventListener("submit", event => {

            event.preventDefault()


            this.btn.disabled = true

            let values = this.getValues(this.formEl)

            if(!values) return false

            this.getPhoto(this.formEl).then(

            (content)=>{

                values.photo = content

                values.save()

                this.addLine(values)

                this.formEl.reset()

                this.btn.disabled = false
            },
            (e)=>{

                console.error(e)

            })
            
        })//End addEventListener
    }//End onSubmit
    getPhoto(formEl){

        let formForEach = [...formEl.elements]

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader()

            let elements = formForEach.filter(item => {

                if(item.name === "photo"){

                    return item

                }

            })

            let file = elements[0].files[0]

            fileReader.onload = () => {

                resolve(fileReader.result) 

            }//End onload photo function

            fileReader.onerror = (e) => {
                reject(e)
            }//End promise reject

            if(file){
            fileReader.readAsDataURL(file)
            }else{
                resolve('dist/img/boxed-bg.jpg')
            }

        })
    }//End getPhoto
        
        

        
    getValues(formEl){

        let formForEach = [...formEl.elements]
        let user = {}
        let isValid = true

        formForEach.forEach( field => {

            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add('has-error')

                isValid = false

                this.btn.disabled = false
            }else{
                field.parentElement.classList.remove('has-error')
            }

            if(field.name == "gender"){
    
                if(field.checked){
    
                    user[field.name] = field.value
                }
    
            }else if(field.name == 'admin'){
                user[field.name] = field.checked
            }else{
                user[field.name] = field.value
            }
        })//End elements.forEach

        if(!isValid){
            return false
        }else{

        }
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
            )
    }//End getValues

    selectAll(){
        let users = User.getUsersStorage() //Guarda na variável todos os usuários e informações contidas no localStorage

        users.forEach(dataUser => {
            let user = new User()

            user.loadFromJSON(dataUser)

            this.addLine(user)

        })
    }//End selectAll


    addLine(dataUser){
        let tr = this.getTr(dataUser)

        this.tableEl.appendChild(tr)

        this.updateCount()
        

    }//End addLine

    getTr(dataUser, tr = null){
        if(tr === null) tr = document.createElement('tr')

        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim':'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>`

            this.addEventsTr(tr)

            return tr
    }
    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener('click', e=>{
            if(confirm("Deseja deletar o usuário?")){

                let user = new User() //Nova instância da class User, já chamando o construtor com os atributos referentes a cada campo de criação de usuário
                
                user.loadFromJSON(JSON.parse(tr.dataset.user)) //Aplico o método que carrega do JSON na instância, aplico um Parse na informação que vai ser passada como parâmetro
                
                user.remove()//Chamo o método criado na classe User, que remove o usuário baseado na localização no localStorage. O método sabe onde fica pois é passado como parâmetro no loadFromJSON
                
                tr.remove()//Não é o mesmo remove do objeto user. Esse é um comando da tag TR criada para guardar as informações no HTML

                this.updateCount()
            }
        })

        tr.querySelector(".btn-edit").addEventListener('click', e=>{

            let json = JSON.parse(tr.dataset.user)
            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

            for(let name in json){
                // let field = form.querySelector(`[name = ${name.replace('_', '')}]`)
                let field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']');

                if(field){

                    switch(field.type){
                        case 'file': 
                        continue
                        break

                        case 'radio':
                        field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + '][value=' + json[name] + ']');
                        field.checked = true
                        break
                        
                        case 'checkbox':
                        field.checked = json[name]
                        break

                        default:
                        field.value = json[name]

                    }
                   
                }

                
            }

        this.formUpdateEl.querySelector(".photo").src = json._photo
            
        document.querySelector('#create-user-box').style.display = 'none'

        document.querySelector('#edit-user-box').style.display = ''
        })
    }

    updateCount(){
        let numberUsers = 0
        let numberAdmin = 0
        let child = [...this.tableEl.children]

        child.forEach(tr=>{

            let user = JSON.parse(tr.dataset.user)

            if(user._admin) {numberAdmin++}
            numberUsers++
        })
        document.querySelector('#number-users').innerHTML = numberUsers
        document.querySelector('#number-users-admin').innerHTML = numberAdmin
    }//End updateCount
}//End class userController