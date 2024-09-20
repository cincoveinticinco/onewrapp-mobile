const getHourMinutesFomISO = (iso: string, withampm: boolean = false): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  if (withampm) {
    // Convert to 12-hour format only if withampm is true
    hours %= 12;
    hours = hours || 12; // '0' should be '12' in 12-hour format
  }

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return withampm ? `${formattedHours}:${formattedMinutes} ${ampm}` : `${formattedHours}:${formattedMinutes}`;
};

export default getHourMinutesFomISO;

export const getAmOrPm = (iso: string): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.getHours() < 12 ? 'AM' : 'PM';
};
