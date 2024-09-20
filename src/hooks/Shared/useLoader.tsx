import { IonSpinner } from '@ionic/react';

const useLoader = () => (
  <IonSpinner
    name="bubbles"
    className="loader"
    color="primary"
    style={{
      position: 'absolute',
      top: 'calc(50% - 20px)',
      left: 'calc(50% - 20px)',
      height: '40px',
      width: '40px',
    }}
  />
);

export default useLoader;
