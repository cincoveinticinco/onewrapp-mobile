const separateTimeOrPages = (value: string): { main: string; symbol: string } => {
  if (value) {
    const [main, symbol] = value?.split(/\s+|\/|:|\./);
    return {
      main: main || '--',
      symbol: symbol ? `/${symbol}` : '',
    };
  }

  return { main: '--', symbol: '' };
};

export default separateTimeOrPages;
