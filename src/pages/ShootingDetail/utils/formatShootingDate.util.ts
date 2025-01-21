export const formatShootingDate = (dateString: string, unitNumber: number): string => {
  const date = new Date(dateString + 'T00:00:00');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const dayOfWeek = weekdays[date.getDay()];
  const dayNumber = date.getDay() === 0 ? 7 : date.getDay();
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${dayOfWeek}. DAY #${dayNumber}. ${month} ${day}, ${year}. UNIT ${unitNumber}`;
};