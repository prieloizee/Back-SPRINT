const connect = require("../db/connect");
const validateUser = require("../services/validateUser");
const validateCpf = require("../services/validateCpf");
const validateLogin = require("../services/validateLogin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class controllerUsuario {
  static async createUser(req, res) {
    const { cpf, email, nome, senha } = req.body;

    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const cpfError = await validateCpf(cpf);
      if (cpfError) {
        return res.status(400).json(cpfError);
      }

      const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

      const query = `INSERT INTO usuario (cpf, senha, email, nome) VALUES (?, ?, ?, ?)`;
      const values = [cpf, hashedPassword, email, nome];

      connect.query(query, values, function (err) {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              error: "O email já está vinculado a outro usuário",
            });
          } else {
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        return res.status(201).json({ message: "Usuário criado com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async loginUser(req, res) {
    const { email, senha } = req.body;

    const validationError = validateLogin(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const query = `SELECT * FROM usuario WHERE email = ?`;

    try {
      connect.query(query, [email], async (err, results) => {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const user = results[0];

        const passwordOK = await bcrypt.compare(senha, user.senha);
        if (!passwordOK) {
          return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign({ id: user.id_usuario }, process.env.SECRET, {
          expiresIn: "1h",
        });

        delete user.senha;

        return res.status(200).json({
          message: "Login bem-sucedido",
          user,
          token,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateUserById(req, res) {
    const id_usuario = req.params.id;
    const { cpf, email, nome, senha } = req.body;

    if (!cpf && !email && !nome && (!senha || senha === "******")) {
      return res.status(400).json({ error: "Nenhum dado para atualizar" });
    }

    try {
      if (cpf) {
        const cpfError = await validateCpf(cpf);
        if (cpfError) {
          return res.status(400).json(cpfError);
        }
      }

      const fields = [];
      const values = [];

      if (nome) {
        fields.push("nome = ?");
        values.push(nome);
      }

      if (email) {
        fields.push("email = ?");
        values.push(email);
      }

      if (senha && senha !== "******") {
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
        fields.push("senha = ?");
        values.push(hashedPassword);
      }

      if (cpf) {
        fields.push("cpf = ?");
        values.push(cpf);
      }

      values.push(id_usuario);

      const query = `UPDATE usuario SET ${fields.join(", ")} WHERE id_usuario = ?`;

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email ou CPF já cadastrados por outro usuário" });
          }
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res.status(200).json({ message: "Lista de Usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getUserById(req, res) {
    const id_usuario = req.params.id;

    const query = `SELECT id_usuario, nome, email, cpf FROM usuario WHERE id_usuario = ?`;

    try {
      connect.query(query, [id_usuario], (err, results) => {
        if (err) {
          console.error("Erro ao buscar usuário por ID:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({ user: results[0] });
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteUser(req, res) {
    const id_usuario = req.params.id;

    const query = `DELETE FROM usuario WHERE id_usuario = ?`;

    try {
      connect.query(query, [id_usuario], function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.status(200).json({ message: "Usuário excluído com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getTotalReservas(req, res) {
    const id_usuario = req.params.id_usuario;
  
    const query = `SELECT total_reservas_usuario(?) AS total`;
  
    try {
      connect.query(query, [id_usuario], (err, results) => {
        if (err) {
          console.error('Erro ao buscar total de reservas:', err);
          return res.status(500).json({ error: 'Erro ao buscar total de reservas' });
        }
  
        return res.status(200).json({ totalReservas: results[0].total });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};  