import React from 'react';
import './HighlightedTextWithArray.scss';
import removeAccents from '../../../utils/removeAccents';

export interface SearchTerm {
  searchTerm: string;
  categoryName: string;
  type: string;
  highlightColor: string;
}

interface HighlightedTextWithArrayProps {
  text: string;
  searchTerms: SearchTerm[];
  textColor?: string;
}

const HighlightedTextWithArray: React.FC<HighlightedTextWithArrayProps> = ({
  text,
  searchTerms,
  textColor = 'var(--ion-color-dark)'
}) => {
  const normalizedText = removeAccents(text).toLowerCase();
  const normalizedSearchTerms = searchTerms.map(term => removeAccents(term.searchTerm).toLowerCase());

  const getOriginalPart = (part: string) => {
    const partIndex = normalizedText.indexOf(part.toLowerCase());
    return text.substring(partIndex, partIndex + part.length);
  };

  const parts = normalizedText.split(new RegExp(`(${normalizedSearchTerms.join('|')})`, 'gi'));

  const getBackgroundColor = (part: string) => {
    const searchTerm = searchTerms.find(term => removeAccents(term.searchTerm).toLowerCase() === removeAccents(part).toLowerCase());
    return searchTerm ? searchTerm.highlightColor : '';
  }

  return (
    <span className="highlighted-text">
      {parts.map((part: any, index: any) => {
        const normalizedPart = removeAccents(part).toLowerCase();
        const isHighlighted = normalizedSearchTerms.includes(normalizedPart);
        return isHighlighted ? (
          <mark style={{ backgroundColor: getBackgroundColor(part), color: textColor }} key={index}>
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