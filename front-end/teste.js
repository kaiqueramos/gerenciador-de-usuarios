var usuarios = [
    {
    nome: "Diego",
    habilidades: ["Javascript", "ReactJS", "Redux"]
    },
    {
    nome: "Gabriel",
    habilidades: ["VueJS", "Ruby on Rails", "Elixir"]
    }
   ]
function result(obj){
    for(item of obj){
        obj.join(',')
        console.log(`O ${obj[0].nome} possui as habilidades ${obj[0].habilidades}`)
        console.log(`O ${obj[1].nome} possui as habilidades ${obj[1].habilidades}`)
    }
}
result(usuarios)