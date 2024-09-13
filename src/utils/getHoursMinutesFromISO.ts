const getHourMinutesFomISO = (iso: string): string => {
  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    return '--:--';
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hours < 10 ? `0${hours}` : hours}:${formattedMinutes}`;
};

export default getHourMinutesFomISO;

export const getAmOrPm = (iso: string): string => {
  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.getHours() < 12 ? 'AM' : 'PM';
};
