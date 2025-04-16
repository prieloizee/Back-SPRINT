const connect = require("../db/connect");
const validateReserva = require("../services/validateReserva");

module.exports = class controllerReserva {
  // CREATE RESERVA
  static async createReservas(req, res) {
    // Corpos da requisição
    const { fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim } = req.body;

      const validationError = validateReserva(req.body);
        if (validationError) {
          return res.status(400).json(validationError);
        }

    try {
      // Verifica se o usuário existe
      const queryUsuario = `SELECT * FROM usuario WHERE id_usuario = ?`;
      const valuesUsuario = [fk_id_usuario];
      const [resultadosU] = await connect.promise().query(queryUsuario, valuesUsuario);
      if (resultadosU.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verifica se a sala existe
      const querySala = `SELECT * FROM sala WHERE id_sala = ?`;
      const valuesSala = [fk_id_sala];
      const [resultadosS] = await connect.promise().query(querySala, valuesSala);
      if (resultadosS.length === 0) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }

      // Verifica se já existe uma reserva no horário solicitado
      const queryHorario = `SELECT datahora_inicio, datahora_fim FROM reserva WHERE fk_id_sala = ? AND (
        (datahora_inicio < ? AND datahora_fim > ?) OR
        (datahora_inicio < ? AND datahora_fim > ?) OR
        (datahora_inicio >= ? AND datahora_inicio < ?) OR
        (datahora_fim > ? AND datahora_fim <= ?)
      )`;

      const valuesHorario = [
        fk_id_sala, datahora_inicio, datahora_inicio, datahora_inicio, datahora_fim,
        datahora_inicio, datahora_fim, datahora_inicio, datahora_fim,
      ];

      const [resultadosH] = await connect.promise().query(queryHorario, valuesHorario);
      if (resultadosH.length > 0) {
        return res.status(400).json({ error: "A sala escolhida já está reservada neste horário" });
      }

      // Query para criar a nova reserva no banco de dados
      const queryInsert = `INSERT INTO reserva (fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim) VALUES (?, ?, ?, ?)`;
      const valuesInsert = [fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim];

      // Realiza a inserção da reserva no banco de dados
      await connect.promise().query(queryInsert, valuesInsert);

      // Retorna sucesso
      return res.status(201).json({ message: "Sala reservada com sucesso!" });
    }  catch (error) {
      console.error("Erro ao criar reserva: ", error); // Log do erro
      return res.status(500).json({ error: "Erro ao criar reserva", details: error.message });
    }
  };

  //TODAS AS RESERVAS 
  static getAllReservas(req, res) {
    const query = `SELECT * FROM reserva`;

    connect.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro Interno do Servidor" });
      }
      
      return res
        .status(200)
        .json({ message: "Obtendo todas as reservas", reservas: results });
    });
  }

  // DELETE
  static deleteReserva(req, res) {
    const reservaId = req.params.id_reserva;
    const query = `DELETE FROM reserva WHERE id_reserva = ?`;
    const values = [reservaId];

    // Deleta a reserva com o ID fornecido
    connect.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro interno no servidor" });
      }

      // Verifica se o reserva foi encontrado e excluído
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }
      return res.status(200).json({ message: "Reserva excluída com sucesso" });
    });
  }
}; 