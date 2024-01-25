import { useEffect } from 'react';

const useHideTabs = () => {
  useEffect(() => {
    const element = document.querySelector('.app-tabs-container');
    if (element instanceof HTMLElement) {
      element.style.display = 'none';
    }

    return () => {
      if (element) {
        if (element instanceof HTMLElement) {
          element.style.display = '';
        }
      }
    };
  }, []);
};

export default useHideTabs;
