export const sortCast = (cast: any[]) => {
  const extractNumber = (str: string) => {
    const match = str.match(/^([A-Z])?(\d+)\./);
    if (match) {
      const [_, letter, number] = match;
      return {
        hasLetter: !!letter,
        number: parseInt(number, 10),
        letter: letter || ''
      };
    }
    return {
      hasLetter: false,
      number: Infinity,
      letter: ''
    };
  };

  const sortedCast = cast.sort((a, b) => {
    const infoA = extractNumber(a.cast);
    const infoB = extractNumber(b.cast);

    // Si uno tiene letra y el otro no
    if (infoA.hasLetter !== infoB.hasLetter) {
      return infoA.hasLetter ? 1 : -1;
    }

    // Si ambos tienen números diferentes
    if (infoA.number !== infoB.number) {
      return infoA.number - infoB.number;
    }

    // Si tienen la misma numeración pero diferentes letras
    if (infoA.letter !== infoB.letter) {
      return infoA.letter.localeCompare(infoB.letter);
    }

    // Si todo lo demás es igual, comparar el string completo
    return a.cast.localeCompare(b.cast);
  });

  console.log('sortedCast', sortedCast);
  return sortedCast;
};
