import React from 'react';
import { IonChip, IonLabel } from '@ionic/react';

interface LegendItem {
  color: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
}

const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {items.map((item, index) => (
        <IonChip key={index} style={{ backgroundColor: 'transparent' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: item.color,
              marginRight: '5px'
            }}
          />
          <IonLabel style={{
            color: 'var(--ion-color-light)',
          }}>{item.label}</IonLabel>
        </IonChip>
      ))}
    </div>
  );
};

export default Legend;