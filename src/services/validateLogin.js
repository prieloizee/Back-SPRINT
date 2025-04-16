module.exports = function validateLogin({email, senha}){
 
    if(!email ||!senha ){
        return{error: "Todos os campos devem ser preenchidos"};
    }
    if(!email.includes("@")){
        return{error:"Email inválido. Deve conter @"};
    }
    return null; // se estiver tudo certo retorna nulo pra ignorar o if na userController
}