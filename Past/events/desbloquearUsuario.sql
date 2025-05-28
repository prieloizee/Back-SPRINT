DELIMITER $$

CREATE EVENT desbloquear_usuarios
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  UPDATE usuario
  SET status = 'ativo'
  WHERE status = 'bloqueado'
    AND id_usuario NOT IN (
      SELECT id_usuario
      FROM cancelamentos_reservas
      WHERE MONTH(data_cancelamento) = MONTH(NOW())
        AND YEAR(data_cancelamento) = YEAR(NOW())
      GROUP BY id_usuario
      HAVING COUNT(*) > 5
    );
END $$

DELIMITER ;
