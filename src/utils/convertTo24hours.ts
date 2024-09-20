const convertTo24Hour = (time: string): string => {
  const [timeStr, period] = time.split(' ');
  const [hours, minutes] = timeStr.split(':');
  let hour = parseInt(hours, 10);

  if (period && period.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period && period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

export default convertTo24Hour;
