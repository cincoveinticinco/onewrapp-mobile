const removeNumberAndDot = (selectedOption: string) => {
  const numberPart = selectedOption.split('.')[0];
  const characterPart = selectedOption.split('.')[1]

  if (numberPart && characterPart) {

    return characterPart.trim()
  }

  return selectedOption.trim()
};

export default removeNumberAndDot;
