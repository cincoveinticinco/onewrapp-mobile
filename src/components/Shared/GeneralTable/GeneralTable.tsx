import React from 'react';
import './GeneralTable.css';
import { IonInput, IonCheckbox, IonRange } from '@ionic/react';
import getHourMinutesFomISO, { getAmOrPm } from '../../../utils/getHoursMinutesFromISO';
import timeToISOString from '../../../utils/timeToIsoString';
import secondsToMinSec from '../../../utils/secondsToMinSec';
import minSecToSeconds from '../../../utils/minSecToSeconds';

export interface Column {
  key: string;
  title: string;
  sticky?: boolean;
  type?: 'text' | 'hour' | 'number' | 'boolean' | 'switch' | 'seconds' | 'currency';
  textAlign?: 'left' | 'center' | 'right';
  editable?: boolean;
  showOnlyWhenEdit?: boolean;
  selectableOptions?: string[];
  switchValues?: { left: any, neutral: any, right: any };
  backgroundColor?: string;
}

interface GeneralTableProps {
  columns: Column[];
  data: any[];
  stickyColumnCount?: number;
  editMode?: boolean;
  editFunction?: (rowIndex: any, rowKey: any, rowValue: any, type: any) => void;
}

const GeneralTable: React.FC<GeneralTableProps> = ({
  columns, data, stickyColumnCount = 1, editMode = false, editFunction
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getColumnValue = (row: any, column: Column, editMode: boolean, rowIndex: number) => {
    const value = row[column.key];

    if (!editMode && column.type) {
      return formatValue(value, column.type, column.switchValues);
    }

    if (!column.editable && column.type) {
      return formatValue(value, column.type, column.switchValues);
    }

    if (editMode && column.editable) {
      return renderEditableInput(value, column.type || 'text', editFunction, rowIndex, column.key, column?.switchValues);
    }

    return formatValue(value, column.type || 'text', column.switchValues);
  };

  const formatValue = (value: any, type: string, switchValues?: { left: any, neutral: any, right: any }) => {
    switch (type) {
      case 'hour':
        return getHourMinutesFomISO(value) + ' ' + getAmOrPm(value);
      case 'seconds':
        return value ? secondsToMinSec(value) : '-- : --';
      case 'number':
        return value != null ? value.toString() : '--';
      case 'boolean':
        return value ? '✓' : '✗';
      case 'switch':
        if (value === switchValues?.left) return -1;
        if (value === switchValues?.right) return 1;
        return 0;
      case 'currency':
        return value != null ? formatCurrency(value) : '--';
      default:
        return value?.toString().toUpperCase() || '--';
    }
  };

  const renderEditableInput = (
    value: any,
    type: string,
    onChange: any,
    rowIndex: any,
    rowKey: any,
    switchValues?: { left: any; neutral: any; right: any }
  ) => {
    const handleChange = (newValue: any) => {
      let formattedValue = newValue;

      if (type === 'hour') {
        const [hours, minutes] = newValue.split(':');
        const currentDate = new Date().toISOString();
        formattedValue = timeToISOString({ hours, minutes }, currentDate);
      } else if (type === 'number' || type === 'currency') {
        formattedValue = Number(newValue);
      } else if (type === 'boolean') {
        formattedValue = Boolean(newValue);
      } else if (type === 'switch') {
        formattedValue = newValue === -1 ? switchValues?.left : newValue === 1 ? switchValues?.right : switchValues?.neutral;
      } else if (type === 'seconds') {
        const [minutes, seconds] = newValue.split(':');
        formattedValue = minSecToSeconds(parseInt(minutes), parseInt(seconds));
      } else {
        formattedValue = newValue;
      }

      onChange(rowIndex, rowKey, formattedValue, type);
    };

    switch (type) {
      case 'boolean':
        return (
          <IonCheckbox
            class='table-checkbox'
            checked={value}
            onIonChange={(e) => handleChange(e.detail.checked)}
          />
        );
      case 'switch':
        const rangeValue = value === switchValues?.left ? -1 : value === switchValues?.right ? 1 : 0;
        return (
          <IonRange
            min={-1}
            max={1}
            step={1}
            snaps={true}
            class={rangeValue === -1 ? 'switch negative' : rangeValue === 1 ? 'switch positive' : 'switch neutral'}
            value={rangeValue}
            onIonChange={(e) => handleChange(e.detail.value)}
          />
        );
      case 'hour':
        return (
          <IonInput
            type="time"
            value={getHourMinutesFomISO(value)}
            onIonChange={(e) => handleChange(e.detail.value)}
          />
        );
      case 'number':
      case 'currency':
        return (
          <IonInput
            type="number"
            value={value}
            onIonChange={(e) => handleChange(e.detail.value)}
          />
        );
      case 'seconds':
        const [minutes, seconds] = secondsToMinSec(value).split(':');
        return (
          <div className="editable-minute">
            <IonInput
              type="number"
              value={minutes}
              onIonChange={(e) => handleChange(`${e.detail.value}:${seconds}`)}
            />
            <p>:</p>
            <IonInput
              type="number"
              value={seconds}
              onIonChange={(e) => handleChange(`${minutes}:${e.detail.value}`)}
            />
          </div>
        );
      default:
        return (
          <IonInput
            type="text"
            value={value}
            onIonChange={(e) => handleChange(e.detail.value)}
          />
        );
    }
  };

  const visibleColumns = editMode
    ? columns
    : columns.filter(column => !column.showOnlyWhenEdit);

  const getFontColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {visibleColumns.map((column, index) => (
                <th
                  key={column.key}
                  className={index < stickyColumnCount ? 'sticky-column' : ''}
                  style={{ left: `${index * 150}px` }}
                >
                  {column.title.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
              >
                {visibleColumns.map((column, colIndex) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className={colIndex < stickyColumnCount ? 'sticky-column' : ''}
                    style={{ 
                      left: `${colIndex * 150}px`, 
                      textAlign: column.textAlign || 'center', 
                      backgroundColor: row[column.backgroundColor as any] 
                    }}
                  >
                    {getColumnValue(row, column, editMode, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralTable;