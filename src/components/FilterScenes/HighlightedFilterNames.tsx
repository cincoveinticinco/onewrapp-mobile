import React from 'react';

interface HighlightedFilterNamesProps {
  option: string;
  checked: () => boolean;
}

const HighlightedFilterNames: React.FC<HighlightedFilterNamesProps> = ({ option, checked }) => {
  const startsWithNumberAndDot = /^[0-9]+\./.test(option);

  const defineColor = (isChecked: boolean) => {
    if (isChecked) {
      return { color: 'var(--ion-color-yellow)' };
    }
    return {};
  };

  if (startsWithNumberAndDot) {
    // If the option starts with a number and a dot, it will be highlighted in red
    const numberAndDotPart = option.match(/^[0-9]+\./)![0];
    const restPart = option.replace(numberAndDotPart, '');

    return (
      <p>
        <span style={{ color: 'var(--ion-color-danger)' }}>{numberAndDotPart}</span>
        <span style={defineColor(checked())}>{restPart.toUpperCase()}</span>
      </p>
    );
  }
  // If the option does not start with a number and a dot, it will be highlighted in blue
  return <p style={defineColor(checked())}>{option.toUpperCase()}</p>;
};

export default HighlightedFilterNames;
