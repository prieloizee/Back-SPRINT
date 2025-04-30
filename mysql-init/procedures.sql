--Excluir reserva
delimiter $$

create procedure `cancelar_reserva` (
    in p_id_reserva int
)
begin
    delete from reserva where id_reserva = p_id_reserva;
end $$

delimiter ;

call cancelar_reserva(2);

--Lista salas disponiveis 

delimiter $$

create procedure listar_salas_disponiveis(in p_inicio datetime, in p_fim datetime)
begin
    select s.id_sala, s.numero as sala
    from sala s
    where s.id_sala not in (
        select r.fk_id_sala
        from reserva r
        where 
            (r.datahora_inicio between p_inicio and p_fim) or
            (r.datahora_fim between p_inicio and p_fim) or
            (p_inicio between r.datahora_inicio and r.datahora_fim) OR
            (p_fim between r.datahora_inicio and r.datahora_fim)
    );
end $$

delimiter ;


call listar_salas_disponiveis('2025-05-01 10:00:00', '2025-05-01 12:00:00');

