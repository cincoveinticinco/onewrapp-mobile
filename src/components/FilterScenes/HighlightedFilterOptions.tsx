import React from 'react';

interface HighlightedFilterOptionProps {
  option: string;
}

const HighlightedFilterOption: React.FC<HighlightedFilterOptionProps> = ({ option }) => {
  const startsWithNumberAndDot = /^[0-9]+\./.test(option);
  
  if (startsWithNumberAndDot) {
    // If the option starts with a number and a dot, it will be highlighted in red
    const numberAndDotPart = option.match(/^[0-9]+\./)![0];
    const restPart = option.replace(numberAndDotPart, '');
    
    return (
      <p>
        <span style={{ color: 'var(--ion-color-danger)' }}>{numberAndDotPart}</span>
        {restPart}
      </p>
    );
  } else {
    // If the option does not start with a number and a dot, it will be highlighted in blue
    return <p>{option}</p>;
  }
};

export default HighlightedFilterOption;