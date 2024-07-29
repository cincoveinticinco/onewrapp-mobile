const getHourMinutesFomISO = (iso: string): string => {
  const date = new Date(iso);

  if (isNaN(date.getTime())) {
    return '--:--';
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hours < 10 ? `0${hours}` : hours}:${formattedMinutes}`;
};

export default getHourMinutesFomISO;
