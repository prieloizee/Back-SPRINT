module.exports = function validateUser({numero, capacidade, descricao}){
 
    if(!numero || !capacidade ||!descricao ){
        return{error: "Todos os campos devem ser preenchidos"};
    }
    return null; // se estiver tudo certo retorna nulo pra ignorar o if na userController
}