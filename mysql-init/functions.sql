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




