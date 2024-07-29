const timeToISOString = (time: { hours: string, minutes: string }, shootingDate: string) => {
  console.log(time, shootingDate);
  const shootingDay = new Date(shootingDate);

  const newDate = new Date(
    shootingDay.getFullYear(),
    shootingDay.getMonth(),
    shootingDay.getDate(),
    parseInt(time.hours),
    parseInt(time.minutes),
  );

  return newDate.toISOString();
};

export default timeToISOString;
