const router = require('express').Router();
const controllerCadastro = require("../controllers/controllerUsuario");
const controllerSala = require("../controllers/controllerSala");
const reservaController = require('../controllers/controllerReserva');
const verifyJWT = require('../services/verifyJWT');

//Rotas Usuario
router.post('/usuario', controllerCadastro.createUser);
router.get('/usuarios',verifyJWT, controllerCadastro.getAllUsers);
router.put('/usuario',verifyJWT, controllerCadastro.updateUser);
router.delete('/usuario/:id',verifyJWT, controllerCadastro.deleteUser);
router.post('/login', controllerCadastro.loginUser);
router.get('/usuario/:id', controllerCadastro.getUserById);

//Rotas salas
router.post('/sala',verifyJWT, controllerSala.createSala);
router.get('/salas',controllerSala.getAllSalas);
router.put('/sala',verifyJWT, controllerSala.updateSala);
router.delete('/sala/:id',verifyJWT, controllerSala.deleteSala);



//Rotas de reserva
router.post("/reserva", reservaController.createReservas); 
router.get("/reservas",reservaController.getAllReservas); 
router.delete("/reserva/:id_reserva", reservaController.deleteReserva);
router.get('/reservas/:id_sala', reservaController.getAllReservasPorSala);
router.post('/disponibilidade', reservaController.getHorariosReservados);


// http://10.89.240.84:5000/projeto_senai/

module.exports = router;