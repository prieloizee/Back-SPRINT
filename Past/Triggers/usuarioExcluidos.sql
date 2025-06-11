CREATE TABLE usuarios_excluidos (
  id_usuario INT,
  nome VARCHAR(100),
  email VARCHAR(100),
  cpf VARCHAR(20),
  data_exclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$

CREATE TRIGGER usuarios_deletados
AFTER DELETE ON usuario
FOR EACH ROW
BEGIN
  INSERT INTO usuarios_excluidos (id_usuario, nome, email, cpf)
  VALUES (OLD.id_usuario, OLD.nome, OLD.email, OLD.cpf);
END$$

DELIMITER ;

SET time_zone = '-03:00';

