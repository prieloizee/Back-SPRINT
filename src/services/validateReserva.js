module.exports = function validateReserva({ fk_id_usuario, fk_id_sala, datahora_inicio, datahora_fim }) {
    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!fk_id_usuario || !fk_id_sala || !datahora_inicio || !datahora_fim) {
      return { error: "Todos os campos devem ser preenchidos" };
    }
  
    // Verifica se a datahora_fim é maior que a datahora_inicio
    if (new Date(datahora_fim).getTime() <= new Date(datahora_inicio).getTime()) {
      return { error: "Data ou Hora Inválida" };
    }
  
    // Verifica se a duração da reserva excede 1 hora
    const limiteHora = 60 * 60 * 1000; // 1 hora em milissegundos
    if (new Date(datahora_fim) - new Date(datahora_inicio) > limiteHora) {
      return { error: "O tempo de Reserva excede o limite (1h)" };
    }
  
    return null; // Se tudo estiver correto, retorna null
  };
  