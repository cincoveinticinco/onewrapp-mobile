import React from 'react';
import './HighlightedText.scss';
import removeAccents from '../../../utils/removeAccents';

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  highlightColor?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerm, highlightColor = 'var(--ion-color-primary)' }) => {
  const normalizedSearchText = removeAccents(searchTerm).toLowerCase();
  const normalizedText = removeAccents(text).toLowerCase();
  const parts = normalizedText.split(new RegExp(`(${normalizedSearchText})`, 'gi'));

  const getOriginalPart = (part: string) => {
    const partIndex = normalizedText.indexOf(part.toLowerCase());
    return text.substring(partIndex, partIndex + part.length);
  };

  return (
    <span className="highlighted-text">
      {
        searchTerm
        && parts.map((part: any, index: any) => (
          removeAccents(part.toUpperCase()) === removeAccents(searchTerm.toUpperCase()) ? (
            <mark style={{ color: highlightColor }} key={index}>{getOriginalPart(part).toUpperCase()}</mark>
          ) : (
            getOriginalPart(part).toUpperCase()
          )
        ))
      }
      {text && !searchTerm && text.toUpperCase()}
    </span>
  );
};

export default HighlightedText;
