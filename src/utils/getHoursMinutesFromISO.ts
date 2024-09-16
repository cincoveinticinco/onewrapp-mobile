import { trainOutline } from "ionicons/icons";

const getHourMinutesFomISO = (iso: string, withampm: boolean = false): string => {
  const date = new Date(iso);
  console.log('iso', iso);
  console.log('date', date);

  if (isNaN(date.getTime())) {
    return '--:--';
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convertir a formato de 12 horas
  hours = hours % 12;
  hours = hours ? hours : 12; // la hora '0' debe ser '12'

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return withampm ? `${formattedHours}:${formattedMinutes} ${ampm}` : `${formattedHours}:${formattedMinutes}`;
};

export default getHourMinutesFomISO;

export const getAmOrPm = (iso: string): string => {
  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.getHours() < 12 ? 'AM' : 'PM';
};
