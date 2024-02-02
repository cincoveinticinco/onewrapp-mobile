const removeNumberAndDot = (selectedOption: string) => {
  const numberAndDotPart = selectedOption.match(/^[0-9]+\./)?.[0] || '';
  const restPart = selectedOption.replace(numberAndDotPart, '');
  return numberAndDotPart ? restPart.trim() : selectedOption.trim();
};

export default removeNumberAndDot;