const connect = require("../db/connect");
const validateUser = require("../services/validateUser");
const validateCpf = require("../services/validateCpf");
const validateLogin = require("../services/validateLogin");
const jwt = require("jsonwebtoken");

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

      // Usando query preparada para evitar injeção de SQL
      const query = `INSERT INTO usuario (cpf, senha, email, nome) VALUES (?, ?, ?, ?)`;
      const values = [cpf, senha, email, nome];

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

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de Usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do Servidor" });
    }
  }

  static async getUserById(req, res) {
const id_usuario = [req.params.id];

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


  static async loginUser(req, res) {
    const { email, senha } = req.body;

    const validationError = validateLogin(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const query = `SELECT * FROM usuario WHERE email = ?`;
    const values = [email];

    try {
      connect.query(query, [email], (err, results) => {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const user = results[0];

        if (user.senha !== senha) {
          return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign({ id: user.id_usuario }, process.env.SECRET, {
          expiresIn: "1h",
        });

        //remove um atributo de objeto(o que é o delete)
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

  static async updateUser(req, res) {
    const { cpf, email, senha, nome, id_usuario } = req.body;

    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const cpfError = await validateCpf(cpf);
      if (cpfError) {
        return res.status(400).json(cpfError);
      }

      const query = `UPDATE usuario SET nome = ?, email = ?, senha = ?, cpf = ? WHERE id_usuario = ?`;
      const values = [nome, email, senha, cpf, id_usuario];

      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuário" });
          }
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteUser(req, res) {
    const id_usuario = req.params.id;

    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [id_usuario];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário excluído com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};