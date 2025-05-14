--Excluir reserva
delimiter $$

create procedure `cancelar_reserva` (
    in p_id_reserva int
)
begin
    delete from reserva where id_reserva = p_id_reserva;
end $$

delimiter ;

call cancelar_reserva(4);