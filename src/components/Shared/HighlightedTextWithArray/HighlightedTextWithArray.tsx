import React from 'react';
import removeAccents from '../../../utils/removeAccents';
import './HighlightedTextWithArray.scss';

export interface SearchTerm {
  searchTerm: string;
  categoryName: (string | null);
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
  textColor = 'var(--ion-color-dark)',
}) => {
  const normalizedText = removeAccents(text);
  const normalizedSearchTerms = searchTerms.map((term) => removeAccents(term.searchTerm).toLowerCase());

  const wordRegex = new RegExp(
    `(\\b${normalizedSearchTerms.join('\\b|\\b')}\\b)`,
    'gi',
  );
  const parts = normalizedText.split(wordRegex);

  const getBackgroundColor = (part: string) => {
    const searchTerm = searchTerms.find(
      (term) => removeAccents(term.searchTerm).toLowerCase() === removeAccents(part).toLowerCase(),
    );
    return searchTerm ? searchTerm.highlightColor : '';
  };

  return (
    <span className="highlighted-text">
      {parts.map((part: any, index: any) => {
        const normalizedPart = removeAccents(part).toLowerCase();
        const isHighlighted = normalizedSearchTerms.includes(normalizedPart);
        return isHighlighted ? (
          <mark
            style={{ backgroundColor: getBackgroundColor(part), color: textColor }}
            key={index}
          >
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </span>
  );
};

export default HighlightedTextWithArray;
