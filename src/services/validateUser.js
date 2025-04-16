module.exports = function validateUser({cpf, email, senha, nome}){
 
    if(!cpf || !email ||!senha ||!nome ){
        return{error: "Todos os campos devem ser preenchidos"};
    }
    if(isNaN(cpf)||cpf.length !==11){
        return {error:"CPF inválido, Deve conter 11 dígitos numéricos"}
    }
    if(!email.includes("@")){
        return{error:"Email inválido. Deve conter @"};
    }
    return null; // se estiver tudo certo retorna nulo pra ignorar o if na userController
}