const timeToISOString = (time: { hours: string, minutes: string }, shootingDate: string) => {
  const shootingDay = new Date(shootingDate);

  const newDate = new Date(
    shootingDay.getFullYear(),
    shootingDay.getMonth(),
    shootingDay.getDate(),
    parseInt(time.hours, 10),
    parseInt(time.minutes, 10),
  );

  return newDate.toISOString();
};

export default timeToISOString;
