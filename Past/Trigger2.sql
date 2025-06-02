DELIMITER $$

CREATE TRIGGER verifica_status_usuario_before_insert
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
  DECLARE user_status VARCHAR(10);

  SELECT status INTO user_status FROM usuario WHERE id_usuario = NEW.fk_id_usuario;

  IF user_status = 'bloqueado' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuário bloqueado não pode fazer reserva';
  END IF;
END$$

DELIMITER ;
