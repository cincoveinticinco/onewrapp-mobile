import { useEffect, useState } from 'react';

const useHideTabs = () => {
  const hideTabs = () => {
    const element = document.querySelector('.app-tabs-container');
    if (element instanceof HTMLElement) {
      element.classList.add('hide-tabs');
    }
  };

  const showTabs = () => {
    const element = document.querySelector('.app-tabs-container');
    if (element instanceof HTMLElement) {
      element.classList.remove('hide-tabs');
    }
  };

  return { hideTabs, showTabs };
};

export default useHideTabs;
