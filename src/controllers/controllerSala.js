const connect = require("../db/connect");
const validateSala = require("../services/validateSala");

module.exports = class controllerSala {
  static async createSala(req, res) {
    const { numero, descricao, capacidade } = req.body;

    const validationError = validateSala(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    // Caso todos os campos estejam preenchidos, realiza a inserção na tabela
    const query = `INSERT INTO sala (numero, capacidade, descricao) VALUES (?, ?, ?)`;
    const values = [numero, capacidade, descricao];

    try {
      connect.query(query, values, function (err) {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              error: "A sala já está cadastrada",
            });
          } else {
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        return res.status(201).json({ message: "Sala criada com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllSalas(req, res) {
    const query = `SELECT * FROM sala`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do Servidor" });
        }

        return res
          .status(200)
          .json({ message: "Lista de salas", sala: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateSala(req, res) {
    const { id_sala, numero, capacidade, descricao } = req.body;

    const validationError = validateSala(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const query = `UPDATE sala SET numero=?, capacidade=?, descricao=? WHERE id_sala = ?`;
    const values = [numero, capacidade, descricao, id_sala];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Sala já cadastrada" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }
        return res.status(200).json({ message: "Sala atualizada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async deleteSala(req, res) {
    const salaId = req.params.id;
    const query = `DELETE FROM sala WHERE id_sala = ?`;
    const values = [salaId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }

        return res.status(200).json({ message: "Sala excluída com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getHorariosReservados(req, res) {
    const { datahora_inicio, datahora_fim, fk_id_usuario, fk_id_sala } = req.body;

    try {
      // Verificar se todos os parâmetros foram fornecidos
      if (!datahora_inicio || !datahora_fim || !fk_id_usuario || !fk_id_sala) {
        return res.status(400).json({ message: 'Todos os parâmetros são necessários' });
      }

      // SQL para verificar a disponibilidade da sala
      const sql = `
        SELECT COUNT(*) AS disponibilidade
        FROM reserva
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
        [fk_id_sala, datahora_inicio, datahora_fim, datahora_inicio, datahora_fim, datahora_inicio, datahora_fim],
        function (err, result) {
          if (err) {
            return res.status(500).json({ message: 'Erro no banco de dados', error: err });
          }

          // Se a contagem for 0, a sala está disponível
          if (result[0].disponibilidade === 0) {
            return res.json({ available: true, message: 'Sala disponível' });
          } else {
            return res.json({ available: false, message: 'Sala não disponível' });
          }
        }
      );
    } catch (error) {
      console.error("Erro ao verificar a disponibilidade da sala:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
