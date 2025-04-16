const express = require("express"); //Importa o modulo Express
const cors = require("cors");
const testConnect = require("./db/testConnect");


class AppController {
  //Define uma classe para organizar a logica de aplicação
  constructor() {
    this.express = express(); //Cria uma nova instacia do express dentro da classe
    this.middlewares(); //Chama o metodo middlewares para configurar os metodo
    this.routes(); //Chama o metodo routes para definir as rotas da Api
    testConnect();
  }
  middlewares() {
    this.express.use(express.json()); //Permitir que a aplicação receba dados em formato JSON nas requisições
    this.express.use(cors());
  }
  //Define as rotas da nossa API
  routes() {
    const apiRoutes = require("./routes/apiRoutes");
    this.express.use("/projeto_senai/", apiRoutes);

  }
}
//Exportando a instacia de Express configurada, para que seja acessada em outros arquivos
module.exports = new AppController().express;