import { useState, useCallback, useContext } from 'react';
import DatabaseContext from '../context/database';

const useHideTabs = () => {
  const {viewTabs, setViewTabs} = useContext(DatabaseContext);

  const hideTabs = useCallback(() => {
    setViewTabs(false);
    console.log('Tabs hidden', viewTabs);
  }, []);

  const showTabs = useCallback(() => {
    setViewTabs(true);
    console.log('Tabs shown', viewTabs);
  }, []);

  return { hideTabs, showTabs, viewTabs, setViewTabs };
};

export default useHideTabs;