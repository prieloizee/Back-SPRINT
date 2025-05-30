DELIMITER $$

CREATE EVENT bloquear_usuarios_abusivos
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  UPDATE usuario
  SET status = 'bloqueado'
  WHERE id_usuario IN (
    SELECT id_usuario
    FROM cancelamentos_reservas
    WHERE MONTH(data_cancelamento) = MONTH(NOW())
      AND YEAR(data_cancelamento) = YEAR(NOW())
    GROUP BY id_usuario
    HAVING COUNT(*) > 5
  );
END $$

DELIMITER ;

-- SELECT id_usuario, status FROM usuario WHERE id_usuario = 1;