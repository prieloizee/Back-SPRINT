-- mostra todas as reservas de um usuario

delimiter $$
create function total_reservas_usuario(id_usuario int)
returns int
reads sql data
begin
    declare total int;

    select count(*) into total
    from reserva
    where id_usuario = reserva.fk_id_usuario;

    return total;
    end; $$
    delimiter ;

select total_reservas_usuario(3) as "Total de reservas";


-- disponibilidade de uma sala
delimiter $$
CREATE FUNCTION verificar_disponibilidade_sala(
    p_id_sala INT,
    p_datahora_inicio DATETIME,
    p_datahora_fim DATETIME
)
RETURNS BOOLEAN
deterministic
BEGIN
    DECLARE v_count INT;

    -- Verificar se a sala está ocupada no período solicitado
    SELECT COUNT(*) INTO v_count
    FROM reserva
    WHERE fk_id_sala = p_id_sala
    AND ((datahora_inicio BETWEEN p_datahora_inicio AND p_datahora_fim)
    OR (datahora_fim BETWEEN p_datahora_inicio AND p_datahora_fim)
    OR (p_datahora_inicio BETWEEN datahora_inicio AND datahora_fim)
    OR (p_datahora_fim BETWEEN datahora_inicio AND datahora_fim));

    RETURN v_count = 0;  -- Retorna TRUE se a sala estiver disponível, caso contrário, FALSE
END $$
delimiter ;

select verificar_disponibilidade_sala(2, '2025-04-17 10:00:00', '2025-04-17 12:00:00') AS disponibilidade;


