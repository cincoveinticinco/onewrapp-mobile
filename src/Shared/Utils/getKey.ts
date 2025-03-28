const getKey = (options: string[], key: string, fallback: string) => {
  // find how many times the key is repeated
  const filteredOptions = options.filter((option) => option === key)
  // if the key is repeated more than once, add the position to the key
  return filteredOptions.length > 1 ? `${key}-${fallback}` : key
}