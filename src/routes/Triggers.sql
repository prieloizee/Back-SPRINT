-- registra o cancelamento de reserva

DELIMITER $$

CREATE TRIGGER registrar_cancelamento
AFTER DELETE ON reserva
FOR EACH ROW
BEGIN
    INSERT INTO cancelamentos_reservas (id_reserva, id_usuario, id_sala data_cancelamento)
    VALUES (OLD.id_reserva, OLD.fk_id_usuario, NOW());
END $$

DELIMITER ;

--  DELETE FROM reserva WHERE id_reserva = 4;

--  SELECT * FROM cancelamentos_reservas WHERE id_reserva = 3;