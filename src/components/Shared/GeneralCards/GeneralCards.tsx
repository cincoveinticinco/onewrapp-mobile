import React, { useEffect, useState } from 'react';
import { IonInput, IonCheckbox, IonRange, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import getHourMinutesFomISO from '../../../utils/getHoursMinutesFromISO';
import timeToISOString from '../../../utils/timeToIsoString';
import secondsToMinSec from '../../../utils/secondsToMinSec';
import minSecToSeconds from '../../../utils/minSecToSeconds';
import { Column } from '../GeneralTable/GeneralTable';
import './GeneralCards.css';

interface GeneralCardsProps {
  columns: Column[];
  data: any[];
  editMode?: boolean;
  editFunction?: (rowIndex: any, rowKey: any, rowValue: any, type: any) => void;
  searchText?: string;
}

const GeneralCards: React.FC<GeneralCardsProps> = ({
  columns,
  data,
  editMode = false,
  editFunction,
  searchText,
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
        return `${getHourMinutesFomISO(value, true)}`;
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
        return value?.toString().toUpperCase() || emptyText || '--';
    }
  };

  const handleEdit = (rowIndex: number, rowKey: string, newValue: any, type: string) => {
    const updatedData = [...filteredData];
    const dataIndex = data.findIndex((item) => item === filteredData[rowIndex]);

    if (dataIndex !== -1) {
      updatedData[rowIndex] = { ...updatedData[rowIndex], [rowKey]: newValue };
      setFilteredData(updatedData);

      if (editFunction) {
        editFunction(dataIndex, rowKey, newValue, type);
      }
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

      handleEdit(rowIndex, rowKey, formattedValue, type);
    };

    switch (type) {
      case 'boolean':
        return (
          <IonCheckbox
            class="table-checkbox"
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
            snaps
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
            <span>:</span>
            <IonInput
              type="number"
              value={seconds}
              onIonChange={(e) => handleChange(`${minutes}:${e.detail.value}`)}
            />
          </div>
        );
      case 'double-data':
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

  const renderHeaderContent = (row: any, column: Column, index: number) => {
    const value = row[column.key];
    const isEditing = editMode

    if (isEditing && column.editable) {
      return renderEditableInput(
        value, 
        column.type || 'text', 
        index, 
        column.key, 
        column.switchValues,
        column?.placeHolder
      );
    }

    return formatValue(value, column.type || 'text', column.switchValues, column?.emptyText);
  };

  const renderCardContent = (row: any, index: number) => {
    const isEditing = editMode

    const headerColumn = columns.find(col => col.header === true);
    const switchColumns = columns.filter(col => col.type === 'switch');
    const contentColumns = columns.filter(col => {
      if (col.header === true || col.type === 'switch') return false;
      if (isEditing) return !col.notShowWhenEdit;
      return !col.showOnlyWhenEdit;
    });

    return (
      <>
        {(headerColumn || switchColumns.length > 0) && (
          <IonCardHeader style={{
            backgroundColor: !isEditing ? row?.backgroundColor : 'var(--ion-color-dark)',
          }}>
            <div className='card-header'>
              {headerColumn && (
                <IonCardTitle className={`card-header`} style={{
                  color: isEditing ? row?.backgroundColor : 'var(--ion-color-dark)',
                }}>
                  {renderHeaderContent(row, headerColumn, index)}
                </IonCardTitle>
              )}
              {switchColumns.length > 0 && editMode && (
                <div className="card-header-switches">
                  {switchColumns.map(switchColumn => (
                    <div key={switchColumn.key} className="header-switch">
                      {renderHeaderContent(row, switchColumn, index)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </IonCardHeader>
        )}
        <IonCardContent>
          <div className="card-content">
            {contentColumns.map((column, index) => {
              const value = row[column.key];

              return (
                <div key={column.key} className="card-field"
                  style={{
                    gridColumn: `span ${column?.colSpan || 2}`,
                  }}
                >
                  <div className="field-label"
                    style={{
                      textAlign: 'left',
                    }}
                  >{column.title}</div>
                  <div 
                    className="field-value"
                    style={{
                      color: column.type === 'boolean' ? 
                        (row[column.key] ? 'var(--ion-color-success)' : 'var(--ion-color-danger)') : 
                        'var(--ion-color-light)',
                      justifyContent: 'center',
                      // minWidth: column.minWidth ? `${column.minWidth}px` : 'auto'
                    }}
                  >
                    {column.type === 'double-data' ? (
                      renderDoubleData(row, column)
                    ) : isEditing && column.editable ? (
                      renderEditableInput(
                        value, 
                        column.type || 'text', 
                        index, 
                        column.key, 
                        column.switchValues,
                        column?.placeHolder
                      )
                    ) : (
                      formatValue(value, column.type || 'text', column.switchValues, column?.emptyText)
                    )}
                  </div>
                </div>
              );
            })}
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