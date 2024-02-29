import { useEffect, useState } from 'react';

const useShowTabs = () => {
  const [alreadyHidden, setAlreadyHidden] = useState(true);
  const currentPath = window.location.pathname;

  useEffect(() => {
    const element = document.querySelector('.app-tabs-container');
    if (element instanceof HTMLElement) {
      element.classList.remove('hide-tabs');
    }
  }, [currentPath]);
};

export default useShowTabs;
