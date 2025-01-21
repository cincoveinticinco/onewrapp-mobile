import React from 'react';
import removeAccents from '../../../utils/removeAccents';
import './HighlightedText.scss';

interface HighlightedTextProps {
  text: string;
  searchTerm?: string;
  highlightColor?: string;
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa todos los caracteres especiales
};

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  highlightColor = 'var(--ion-color-primary)',
}) => {
  if (!text) return null;

  if (!searchTerm) {
    return <>{text.toString().toUpperCase()}</>;
  }

  const normalizedSearchText = removeAccents(searchTerm).toLowerCase();
  const escapedSearchText = escapeRegExp(normalizedSearchText);
  const normalizedText = removeAccents(text).toLowerCase();
  const parts = normalizedText.split(new RegExp(`(${escapedSearchText})`, 'gi'));

  const getOriginalPart = (part: string, startIndex: number): string =>
    text.substr(startIndex, part.length);

  let currentIndex = 0;

  return (
    <>
      {parts.map((part, index) => {
        const originalPart = getOriginalPart(part, currentIndex);
        currentIndex += part.length;

        if (removeAccents(part.toLowerCase()) === normalizedSearchText) {
          return (
            <span key={index} style={{ backgroundColor: highlightColor }}>
              {originalPart.toUpperCase()}
            </span>
          );
        }
        return originalPart.toUpperCase();
      })}
    </>
  );
};

export default HighlightedText;
