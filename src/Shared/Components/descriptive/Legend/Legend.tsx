import { IonChip, IonLabel } from '@ionic/react';
import React from 'react';

interface LegendItem {
  color: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
  className?: string;
}

const Legend: React.FC<LegendProps> = ({ items, className }) => (
  <div
    className={className}
    style={className ? undefined : {
      display: 'flex', justifyContent: 'flex-start', gap: '10px', margin: '6px 0px', flexWrap: 'wrap',
    }}
  >
    {items.map((item) => (
      <IonChip
        key={`chip-legend-${item.label}`}
        className={className ? `${className}-item` : undefined}
        style={className ? undefined : { backgroundColor: 'transparent', flex: '1' }}
      >
        <div
          className={className ? `${className}-dot` : undefined}
          style={{
            width: className ? undefined : '16px',
            height: className ? undefined : '16px',
            borderRadius: className ? undefined : '50%',
            backgroundColor: item.color,
            marginRight: className ? undefined : '12px',
            flexShrink: className ? undefined : 0,
          }}
        />
        <IonLabel style={className ? undefined : {
          fontSize: '14px',
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
