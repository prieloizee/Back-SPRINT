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
create function verificar_disponibilidade_sala(
    p_id_sala int,
    p_datahora_inicio datetime,
    p_datahora_fim datetime
)
returns boolean
deterministic
begin
    declare v_count int;

    -- Verificar se a sala está ocupada no período solicitado
    select count(*) into v_count
    from reserva
    where fk_id_sala = p_id_sala
    and ((datahora_inicio between p_datahora_inicio and p_datahora_fim)
    or (datahora_fim between p_datahora_inicio and p_datahora_fim)
    or (p_datahora_inicio between datahora_inicio and datahora_fim)
    or (p_datahora_fim between datahora_inicio and datahora_fim));

    return v_count = 0;  -- Retorna TRUE se a sala estiver disponível, caso contrário, FALSE
end $$
delimiter ;

select verificar_disponibilidade_sala(2, '2025-04-17 10:00:00', '2025-04-17 12:00:00') as disponibilidade;


