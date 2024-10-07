import React, { useEffect, useState } from 'react';
import { IonInput, IonCheckbox, IonRange, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import getHourMinutesFomISO from '../../../utils/getHoursMinutesFromISO';
import timeToISOString from '../../../utils/timeToIsoString';
import secondsToMinSec from '../../../utils/secondsToMinSec';
import minSecToSeconds from '../../../utils/minSecToSeconds';
import { Column } from '../GeneralTable/GeneralTable';
import './GeneralCards.css';
import colorIsDark from '../../../utils/colorIsDark';

interface GeneralCardsProps {
  columns: Column[];
  data: any[];
  editMode?: boolean;
  editFunction?: (rowIndex: any, rowKey: any, rowValue: any, type: any) => void;
  searchText?: string;
  numberOfColumns?: number;
}

const GeneralCards: React.FC<GeneralCardsProps> = ({
  columns,
  data,
  editMode = false,
  editFunction,
  searchText,
  numberOfColumns = 12,
}) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchText && searchText !== '') {
        const lowerCaseSearchText = searchText.toLowerCase();
        const newFilteredData = data.filter((row) => {
          const rowValues = Object.values(row);
          return rowValues.some((value) => {
            if (typeof value === 'string') {
              return value.toLowerCase().includes(lowerCaseSearchText);
            }
            return false;
          });
        });
        setFilteredData(newFilteredData);
      } else {
        setFilteredData(data);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchText, data]);

  const formatCurrency = (value: number): string => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  const renderDoubleData = (row: any, column: Column) => {
    const primaryValue = row[column.key] || '';
    const secondaryValue = column.secondaryKey ? row[column.secondaryKey] : '';

    return (
      <div className="double-data-container">
        <div className="primary-data">{primaryValue}</div>
        <div className="secondary-data">{secondaryValue}</div>
      </div>
    );
  };

  const formatValue = (value: any, type: string, switchValues?: { left: any, neutral: any, right: any }, emptyText?: string) => {
    switch (type) {
      case 'hour':
        return getHourMinutesFomISO(value, true);
      case 'seconds':
        return value ? secondsToMinSec(value) : '-- : --';
      case 'number':
        return value != null ? value.toString() : 0;
      case 'boolean':
        return value ? '✓' : '✗';
      case 'switch':
        if (value === switchValues?.left) return -1;
        if (value === switchValues?.right) return 1;
        return 0;
      case 'currency':
        return value != null ? formatCurrency(value) : '--';
      default:
        return value?.toString().toUpperCase() || emptyText || '--';
    }
  };

  const handleEdit = (rowIndex: number, rowKey: string, newValue: any, type: string) => {
    const dataIndex = data.findIndex((item) => item === filteredData[rowIndex]);
    
    if (dataIndex !== -1 && editFunction) {
      const updatedData = [...filteredData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [rowKey]: newValue };
      setFilteredData(updatedData);
      editFunction(dataIndex, rowKey, newValue, type);
    }
  };

  const renderEditableInput = (
    value: any,
    type: string,
    rowIndex: number,
    rowKey: string,
    switchValues?: { left: any; neutral: any; right: any },
    placeHolder?: string,
  ) => {
    const handleChange = (newValue: any) => {
      let formattedValue: any;

      switch (type) {
        case 'hour':
          const [hours, minutes] = newValue.split(':');
          formattedValue = timeToISOString({ hours, minutes }, new Date().toISOString());
          break;
        case 'number':
        case 'currency':
          formattedValue = Number(newValue);
          break;
        case 'boolean':
          formattedValue = Boolean(newValue);
          break;
        case 'switch':
          formattedValue = newValue === -1 ? switchValues?.left : 
                          newValue === 1 ? switchValues?.right : 
                          switchValues?.neutral;
          break;
        case 'seconds':
          const [mins, secs] = newValue.split(':');
          formattedValue = minSecToSeconds(parseInt(mins), parseInt(secs));
          break;
        default:
          formattedValue = newValue;
      }

      handleEdit(rowIndex, rowKey, formattedValue, type);
    };

    switch (type) {
      case 'boolean':
        return (
          <IonCheckbox
            className="table-checkbox"
            checked={value}
            onIonChange={(e) => handleChange(e.detail.checked)}
          />
        );
      case 'switch':
        const rangeValue = value === switchValues?.left ? -1 : 
                          value === switchValues?.right ? 1 : 0;
        return (
          <IonRange
            min={-1}
            max={1}
            step={1}
            snaps
            className={`switch ${rangeValue === -1 ? 'negative' : rangeValue === 1 ? 'positive' : 'neutral'}`}
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
            placeholder='00:00'
          />
        );
      case 'number':
      case 'currency':
        return (
          <IonInput
            type="number"
            value={value || 0}
            onIonChange={(e) => handleChange(e.detail.value)}
            placeholder="0"
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
              placeholder="00"
            />
            <span>:</span>
            <IonInput
              type="number"
              value={seconds}
              onIonChange={(e) => handleChange(`${minutes}:${e.detail.value}`)}
              placeholder="00"
            />
          </div>
        );
      default:
        return (
          <IonInput
            type="text"
            value={value}
            onIonChange={(e) => handleChange(e.detail.value)}
            placeholder={placeHolder}
          />
        );
    }
  };

  const renderField = (row: any, column: Column, rowIndex: number) => {
    const value = row[column.key];
    
    if (column.type === 'double-data') {
      return renderDoubleData(row, column);
    }
    
    if (editMode && column.editable) {
      return renderEditableInput(
        value,
        column.type || 'text',
        rowIndex,
        column.key,
        column.switchValues,
        column.placeHolder
      );
    }
    
    return formatValue(value, column.type || 'text', column.switchValues, column.emptyText);
  };

  const renderCardContent = (row: any, rowIndex: number) => {
    const headerColumn = columns.find(col => col.header);
    const switchColumns = columns.filter(col => col.type === 'switch');
    const contentColumns = columns.filter(col => {
      if (col.header || col.type === 'switch') return false;
      return editMode ? !col.notShowWhenEdit : !col.showOnlyWhenEdit;
    });

    return (
      <>
        {(headerColumn || switchColumns.length > 0) && (
          <IonCardHeader 
            style={{
              backgroundColor: !editMode ? row?.backgroundColor : 'var(--ion-color-dark)',
            }}
          >
            <div className="card-header">
              {headerColumn && (
                <IonCardTitle 
                  className="card-header"
                  style={{
                    color: !editMode && colorIsDark(row?.backgroundColor) ? 'var(--ion-color-light)' : editMode && row?.backgroundColor !== 'var(--ion-color-dark)' ? row?.backgroundColor : 'var(--ion-color-light)',
                  }}
                >
                  {renderField(row, headerColumn, rowIndex)}
                </IonCardTitle>
              )}
              {switchColumns.length > 0 && editMode && (
                <div className="card-header-switches">
                  {switchColumns.map(column => (
                    <div key={column.key} className="header-switch">
                      {renderField(row, column, rowIndex)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </IonCardHeader>
        )}
        <IonCardContent>
          <div 
            className="card-content"
            style={{
              gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
            }}
          >
            {contentColumns.map((column) => (
              <div 
                key={column.key} 
                className="card-field"
                style={{
                  gridColumn: `span ${column.colSpan || 2}`,
                }}
              >
                <div 
                  className="field-label"
                  style={{ textAlign: 'left' }}
                >
                  {column.title}
                </div>
                <div 
                  className="field-value"
                  style={{
                    color: column.type === 'boolean' 
                      ? (row[column.key] ? 'var(--ion-color-success)' : 'var(--ion-color-danger)') 
                      : 'var(--ion-color-light)',
                    justifyContent:  'left',
                  }}
                >
                  {renderField(row, column, rowIndex)}
                </div>
              </div>
            ))}
          </div>
        </IonCardContent>
      </>
    );
  };

  return (
    <div className="cards-container">
      {filteredData.map((row, index) => (
        <IonCard key={index} className={`general-card ${editMode ? 'editing' : ''}`}>
          {renderCardContent(row, index)}
        </IonCard>
      ))}
    </div>
  );
};

export default GeneralCards;