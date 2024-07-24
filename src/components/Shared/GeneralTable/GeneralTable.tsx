import React from 'react';
import './GeneralTable.css';
import getHourMinutesFomISO from '../../../utils/getHoursMinutesFromISO';
import { IonInput } from '@ionic/react';
import timeToISOString from '../../../utils/timeToIsoString';

export interface Column {
  key: string;
  title: string;
  sticky?: boolean;
  type?: 'text' | 'hour' | 'number';
  textAlign?: 'left' | 'center' | 'right';
  editable?: boolean;
}

interface GeneralTableProps {
  columns: Column[];
  data: any[];
  stickyColumnCount?: number;
  editMode?: boolean;
  editFunction?: (rowIndex: any, rowKey: any, rowValue: any, type: any) => void;
}

const GeneralTable: React.FC<GeneralTableProps> = ({ columns, data, stickyColumnCount = 1, editMode = false, editFunction }) => {
  const getColumnValue = (row: any, column: Column, editMode: boolean, rowIndex: number) => {
    const value = row[column.key];
  
    if (!editMode && column.type) {
      return formatValue(value, column.type);
    }
  
    if (!column.editable && column.type) {
      return formatValue(value, column.type);
    }
  
    if(editMode && column.editable) {
      return renderEditableInput(value, column.type || 'text', editFunction, rowIndex, column.key);
    }

    return formatValue(value, column.type || 'text');
  };
  
  const formatValue = (value: any, type: string) => {
    switch (type) {
      case 'hour':
        return getHourMinutesFomISO(value);
      case 'number':
        return value != null ? value.toString() : '--';
      default:
        return value?.toString().toUpperCase() || '--';
    }
  };
  
  const renderEditableInput = (value: any, type: string, onChange: any, rowIndex: any, rowKey: any) => {
    const commonProps = {
      value: type === 'hour' ? getHourMinutesFomISO(value) : value,
      onIonChange: (e: CustomEvent) => onChange(rowIndex, rowKey, e.detail.value, type),
      style: { width: 'auto' }
    };
  
    return (
      <IonInput
        {...commonProps}
        type={type === 'hour' ? 'time' : type === 'number' ? 'number' : 'text'}
      />
    );
  };

  return (
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.key} 
                  className={index < stickyColumnCount ? 'sticky-column' : ''}
                  style={{left: `${index * 150}px`}}
                >
                  {column.title.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${column.key}`}
                    className={colIndex < stickyColumnCount ? 'sticky-column' : ''}
                    style={{left: `${colIndex * 150}px`, textAlign: column.textAlign || 'center' }}
                  >
                    {getColumnValue(row, column, editMode, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default GeneralTable;
