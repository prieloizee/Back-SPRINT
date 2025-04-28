
 --Mostrar todas as reservas feitas por um usuário, com detalhes sobre a reserva

  delimiter //

create procedure total_reservas_usuarios(
    in p_id_usuario int,
    out p_total_reservas int
)
begin 
    -- Inicializando a variável de saída
    set p_total_reservas = 0;

    -- Realizando a consulta para calcular o total de reservas para o usuário
    select coalesce(sum(ir.quantidade), 0)
    into p_total_reservas
    from reserva_feita ir
    join reserva r ON ir.fk_id_reserva = r.id_reserva
    where r.fk_id_usuario = p_id_usuario;

end //

delimiter ;

show procedure status where db = 'projeto_senai';

set @total = 0;

call total_reservas_usuarios(2, @total);


--Excluir reserva
DELIMITER $$

create procedure `cancelar_reserva` (
    IN p_id_reserva INT
)
BEGIN
    DELETE FROM reserva WHERE id_reserva = p_id_reserva;
END $$

DELIMITER ;

call cancelar_reserva(3);
