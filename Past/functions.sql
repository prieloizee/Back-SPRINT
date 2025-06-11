-- mostra todas as reservas de um usuario

DELIMITER $$
CREATE FUNCTION total_reservas_usuario(id_usuario INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total INT;

    SELECT COUNT(*) INTO total
    FROM reserva
    WHERE fk_id_usuario = id_usuario;

    RETURN total;
END $$ 
DELIMITER ;


select total_reservas_usuario(3) as "Total de reservas";




