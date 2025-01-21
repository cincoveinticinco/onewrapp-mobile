  export const timeToISOString = (time: { hours: string, minutes: string }, shootingDate: string) => {
    try {
      // Asegurarse de que la fecha es válida
      const shootingDay = new Date(shootingDate);
      if (isNaN(shootingDay.getTime())) {
        throw new Error('Invalid shooting date');
      }
  
      // Validar horas y minutos
      const hours = parseInt(time.hours, 10);
      const minutes = parseInt(time.minutes, 10);
  
      if (isNaN(hours) || hours < 0 || hours > 23) {
        throw new Error('Invalid hours');
      }
      if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        throw new Error('Invalid minutes');
      }
  
      // Crear la fecha usando la zona horaria local
      const newDate = new Date(
        shootingDay.getFullYear(),
        shootingDay.getMonth(),
        shootingDay.getDate(),
        hours,
        minutes
      );
  
      // Verificar que la fecha resultante es válida
      if (isNaN(newDate.getTime())) {
        throw new Error('Generated invalid date');
      }
  
      return newDate.toISOString();
    } catch (error) {
      console.error('Error in timeToISOString:', error);
      console.error('Input values:', { shootingDate, time });
      throw error;
    }
  };