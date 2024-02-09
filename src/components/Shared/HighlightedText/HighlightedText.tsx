import React from "react";
import './HighlightedText.scss';

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerm }) => {
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

  return (
    <span className="highlighted-text">
      {parts.map((part: any, index: any) => (
        part.toUpperCase() === searchTerm.toUpperCase() ? (
          <mark key={index}>{part.toUpperCase()}</mark>
        ) : (
          part.toUpperCase()
        )
      ))}
    </span>
  );
};

export default HighlightedText;