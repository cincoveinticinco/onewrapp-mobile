const separateTimeOrPages = (value: string): { main: string; symbol: string } => {
  if (value) {
    const [main, symbol] = value?.split(/[:.\/]/);
    return { main: main || '--', symbol: symbol ? (value.includes(':') ? `:${symbol}` : `/${symbol}`) : '' };
  }

  return { main: '--', symbol: '' };
};

export default separateTimeOrPages;
