import { useEffect, useRef, useState } from "react";

const useTextSelection = (handlePopupOpen: (selectedText: string, x: number, y: number) => void) => {
  const selectionRef = useRef<string | null>(null);
  const [selectedText, setSelectedText] = useState('');

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 1) {
      selectionRef.current = selection.toString();
      setSelectedText(selectionRef.current);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const x = rect.x;
      const y = rect.y;
      handlePopupOpen(selectionRef.current, x, y);
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [handlePopupOpen]);

  return { selectedText, setSelectedText, handleSelection };
};

export default useTextSelection;