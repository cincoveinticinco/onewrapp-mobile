import React from 'react';
import removeAccents from '../../../utils/removeAccents';
import './HighlightedText.scss';

interface HighlightedTextProps {
  text: string;
  searchTerm?: string;
  highlightColor?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  highlightColor = 'var(--ion-color-primary)',
}) => {
  // If text is empty or undefined, return null
  if (!text) return null;

  // If searchTerm is undefined or empty, just return the uppercase text
  if (!searchTerm) {
    return (
      <span className="highlighted-text">
        {
      text.toString().toUpperCase()
    }
      </span>
    );
  }

  const normalizedSearchText = removeAccents(searchTerm).toLowerCase();
  const normalizedText = removeAccents(text).toLowerCase();
  const parts = normalizedText.split(new RegExp(`(${normalizedSearchText})`, 'gi'));

  const getOriginalPart = (part: string, startIndex: number): string => text.substr(startIndex, part.length);

  let currentIndex = 0;

  return (
    <span className="highlighted-text">
      {parts.map((part, index) => {
        const originalPart = getOriginalPart(part, currentIndex);
        currentIndex += part.length;

        if (removeAccents(part.toLowerCase()) === normalizedSearchText) {
          return (
            <mark style={{ color: highlightColor }} key={index}>
              {originalPart.toUpperCase()}
            </mark>
          );
        }
        return originalPart.toUpperCase();
      })}
    </span>
  );
};

export default HighlightedText;
