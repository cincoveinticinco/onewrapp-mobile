import React from 'react';
import { useHistory } from 'react-router';

const useHandleBack = () => {
  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  };

  return handleBack;
};

export default useHandleBack;
