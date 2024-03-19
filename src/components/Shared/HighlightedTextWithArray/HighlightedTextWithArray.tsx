import React from 'react';
import './HighlightedTextWithArray.scss';
import removeAccents from '../../../utils/removeAccents';

interface HighlightedTextWithArrayProps {
  text: string;
  searchTerms: string[];
  highlightColor?: string;
  textColor?: string;
}

const HighlightedTextWithArray: React.FC<HighlightedTextWithArrayProps> = ({ text, searchTerms, highlightColor = 'var(--ion-color-primary)', textColor = 'var(--ion-color-dark)' }) => {
  const normalizedText = removeAccents(text).toLowerCase();
  const normalizedSearchTerms = searchTerms.map(term => removeAccents(term).toLowerCase());

  const getOriginalPart = (part: string) => {
    const partIndex = normalizedText.indexOf(part.toLowerCase());
    return text.substring(partIndex, partIndex + part.length);
  };

  const parts = normalizedText.split(new RegExp(`(${normalizedSearchTerms.join('|')})`, 'gi'));

  return (
    <span className="highlighted-text">
      {parts.map((part: any, index: any) => {
        const normalizedPart = removeAccents(part).toLowerCase();
        const isHighlighted = normalizedSearchTerms.includes(normalizedPart);
        return isHighlighted ? (
          <mark style={{ backgroundColor: highlightColor, color: textColor }} key={index}>
            {getOriginalPart(part)}
          </mark>
        ) : (
          getOriginalPart(part)
        );
      })}
    </span>
  );
};

export default HighlightedTextWithArray;