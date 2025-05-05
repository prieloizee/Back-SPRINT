const app = require("./index"); //Importar a instância do Express configurada em index.js
const cors = require("cors");

const corsOpitions = {
    origin: '*', // Substitua pela origem permitida
    methods: 'GET,HEAD,PUT,POST,DELETE', // Métodos HTTP permitidos (corrigido de PATH.POST para POST)
    credentials: true, // Permite o uso de cookies e credenciais
    optionsSuccessStatus: 204, // Define o status de resposta para o método OPTIONS
};

// Aplicando o middleware CORS no app
app.use(cors(corsOpitions));
app.listen(5000); 

// http://10.89.240.68:5000/projeto_senai/
