const connect = require("../db/connect");
const validateReserva = require("../services/validateReserva");

module.exports = class controllerReserva {
  // CREATE RESERVA
  static async createReservas(req, res) {
    // Corpos da requisição
    const { fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim } =
      req.body;

    console.log(
      "Body: ",
      fk_id_usuario,
      fk_id_sala,
      datahora_inicio,
      datahora_fim
    );

    const validationError = validateReserva(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      // Verifica se o usuário existe
      const queryUsuario = `SELECT * FROM usuario WHERE id_usuario = ?`;
      const valuesUsuario = [fk_id_usuario];
      const [resultadosU] = await connect
        .promise()
        .query(queryUsuario, valuesUsuario);
      if (resultadosU.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verifica se a sala existe
      const querySala = `SELECT * FROM sala WHERE id_sala = ?`;
      const valuesSala = [fk_id_sala];
      const [resultadosS] = await connect
        .promise()
        .query(querySala, valuesSala);
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
        fk_id_sala,
        datahora_inicio,
        datahora_inicio,
        datahora_inicio,
        datahora_fim,
        datahora_inicio,
        datahora_fim,
        datahora_inicio,
        datahora_fim,
      ];

      const [resultadosH] = await connect
        .promise()
        .query(queryHorario, valuesHorario);
      if (resultadosH.length > 0) {
        return res
          .status(400)
          .json({ error: "A sala escolhida já está reservada neste horário" });
      }

      // Query para criar a nova reserva no banco de dados
      const queryInsert = `INSERT INTO reserva (fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim) VALUES (?, ?, ?, ?)`;
      const valuesInsert = [
        fk_id_usuario,
        fk_id_sala,
        datahora_inicio,
        datahora_fim,
      ];

      // Realiza a inserção da reserva no banco de dados
      await connect.promise().query(queryInsert, valuesInsert);

      // Retorna sucesso
      return res.status(201).json({ message: "Sala reservada com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar reserva: ", error); // Log do erro
      return res
        .status(500)
        .json({ error: "Erro ao criar reserva", details: error.message });
    }
  }

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

  static getAllReservasPorSala(req, res) {
    const idSala = req.params.id_sala; // Obtendo o ID da sala a partir dos parâmetros da URL

    if (!idSala) {
      return res.status(400).json({ error: "ID da sala não fornecido" });
    }

    const query = `SELECT * FROM reserva WHERE fk_id_sala = ?`;

    connect.query(query, [idSala], (err, results) => {
      if (err) {
        console.error("Erro ao consultar a reserva:", err);
        return res.status(500).json({ error: "Erro Interno do Servidor" });
      }

      // Se não houver nenhuma reserva, retornar 404
      if (results.length === 0) {
        return res
          .status(404)
          .json({
            message: `Nenhuma reserva encontrada para a sala de ID ${idSala}`,
          });
      }

      return res.status(200).json({
        message: `Reservas para a sala de ID ${idSala}`,
        reservas: results,
      });
    });
  }

  static async getHorariosReservados(req, res) {
    //const { datahora_inicio, datahora_fim, fk_id_usuario, fk_id_sala } = req.query;
    const { datahora_inicio, datahora_fim, fk_id_sala } = req.body;

    console.log("Valores recebidos: ",datahora_inicio,datahora_fim,fk_id_sala
    );

    try {
      // Verificar se todos os parâmetros foram fornecidos
      if (!datahora_inicio || !datahora_fim || !fk_id_sala) {
        return res
          .status(400)
          .json({ message: "Todos os campos devem ser preenchidos" });
      }

      // SQL para verificar a disponibilidade da sala
      const sql = `
      select count(*) as disponibilidade
      from reserva
      WHERE fk_id_sala = ? 
      AND (
        (datahora_inicio BETWEEN ? AND ?) 
        OR (datahora_fim BETWEEN ? AND ?)
        OR (? BETWEEN datahora_inicio AND datahora_fim)
        OR (? BETWEEN datahora_inicio AND datahora_fim)
      );
    `;

      // Executar a query para verificar a disponibilidade
      connect.query(
        sql,
        [
          fk_id_sala,
          datahora_inicio,
          datahora_fim,
          datahora_inicio,
          datahora_fim,
          datahora_inicio,
          datahora_fim,
        ],
        function (err, result) {
          if (err) {
            return res
              .status(500)
              .json({ message: "Erro no banco de dados", error: err });
          }

          // Se a contagem for 0, a sala está disponível
          if (result[0].disponibilidade === 0) {
            return res.json({ available: true, message: "Sala disponível" });
          } else {
            return res.json({
              available: false,
              message: "Sala não disponível",
            });
          }
        }
      );
    } catch (error) {
      console.error("Erro ao verificar a disponibilidade da sala:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }


  static async getReservasPorUsuario(req, res) {
    const id_usuario = req.params.id_usuario;
    console.log("ID do usuário recebido:", id_usuario);

    const query = `SELECT * FROM reserva WHERE fk_id_usuario = ?`;
    const values = [id_usuario];
  
    try {
      const [results] = await connect.promise().query(query, values);
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Nenhuma reserva encontrada para esse usuário" });
      }
  
      return res.status(200).json({ reservas: results });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};  