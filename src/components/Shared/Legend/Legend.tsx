import React from 'react';
import { IonChip, IonLabel } from '@ionic/react';

interface LegendItem {
  color: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
}

const Legend: React.FC<LegendProps> = ({ items }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', margin: '6px 0px'}}>
    {items.map((item, index) => (
      <IonChip key={index} style={{ backgroundColor: 'transparent' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: item.color,
            marginRight: '12px',
          }}
        />
        <IonLabel style={{
          color: 'var(--ion-color-light)',
        }}
        >
          {item.label}
        </IonLabel>
      </IonChip>
    ))}
  </div>
);

export default Legend;
