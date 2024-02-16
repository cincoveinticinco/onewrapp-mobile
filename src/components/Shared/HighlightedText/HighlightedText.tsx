import React from "react";
import './HighlightedText.scss';

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  highlightColor?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerm, highlightColor = "var(--ion-color-primary)" }) => {
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

  return (
    <span className="highlighted-text">
      {parts.map((part: any, index: any) => (
        part.toUpperCase() === searchTerm.toUpperCase() ? (
          <mark style={{color: highlightColor}} key={index}>{part.toUpperCase() }</mark>
        ) : (
          part.toUpperCase()
        )
      ))}
    </span>
  );
};

export default HighlightedText;