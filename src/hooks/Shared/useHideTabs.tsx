import { useCallback, useContext } from 'react';
import DatabaseContext from '../../context/Database.context';

const useHideTabs = () => {
  const { viewTabs, setViewTabs } = useContext(DatabaseContext);

  const hideTabs = useCallback(() => {
    setViewTabs(false);
  }, []);

  const showTabs = useCallback(() => {
    setViewTabs(true);
  }, []);

  return {
    hideTabs, showTabs, viewTabs, setViewTabs,
  };
};

export default useHideTabs;
