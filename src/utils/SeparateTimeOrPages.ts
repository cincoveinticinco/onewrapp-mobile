const separateTimeOrPages = (value: string): { main: string; symbol: string } => {
  const [main, symbol] = value.split(/[:.\/]/);
  return { main: main || '--', symbol: symbol ? (value.includes(':') ? `:${symbol}` : `/${symbol}`) : '' };
};

export default separateTimeOrPages;