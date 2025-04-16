-- Registrará todas as reservas
delimiter //

create procedure registrar_reserva (
    in p_id_usuario int,
    in p_id_sala int,
    in p_datahora_inicio datetime,
    in p_datahora_fim datetime
)
begin
    declare v_id_reserva int; -- declaração da variavel


    insert into reserva (datahora_inicio, datahora_fim, fk_id_usuario, fk_id_sala)
    values (p_datahora_inicio, p_datahora_fim, p_id_usuario, p_id_sala);

    set v_id_reserva = last_insert_id();

end //

delimiter ;


  --mostar todos as reservas feitas

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
