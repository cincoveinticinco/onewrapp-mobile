import { useEffect } from 'react';

const useScrollToTop = (contentRef: any, thisPath: any) => {
  useEffect(() => {
    contentRef.current?.scrollToTop();
  }, [contentRef, thisPath]);
};

export default useScrollToTop;