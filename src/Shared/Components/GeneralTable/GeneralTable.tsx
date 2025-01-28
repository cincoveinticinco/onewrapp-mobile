import React, { useEffect, useState } from 'react';
import './GeneralTable.css';
import {
  IonInput, IonCheckbox, IonRange
} from '@ionic/react';
import getHourMinutesFomISO from '../../Utils/getHoursMinutesFromISO';
import timeToISOString from '../../Utils/timeToIsoString';
import secondsToMinSec from '../../Utils/secondsToMinSec';
import minSecToSeconds from '../../Utils/minSecToSeconds';
import HighlightedText from '../HighlightedText/HighlightedText';
import DropDownButton from '../DropDownButton/DropDownButton';

export type EditFunction = (rowIndex: any, rowKey: any, rowValue: any, type: any) => void;

export interface Column {
  key: string;
  title: string;
  sticky?: boolean;
  type?: 'text' | 'hour' | 'number' | 'boolean' | 'switch' | 'seconds' | 'currency' | 'double-data';
  textAlign?: 'left' | 'center' | 'right';
  editable?: boolean;
  showOnlyWhenEdit?: boolean;
  selectableOptions?: string[];
  switchValues?: { left: any, neutral: any, right: any };
  backgroundColor?: string;
  secondaryKey?: string;
  notShowWhenEdit?: boolean;
  header?: boolean;
  colSpan?: number;
  placeHolder?: string;
  emptyText?: string;
  minWidth?: number;
  maxWidth?: number;
}

interface GeneralTableProps {
  columns: Column[];
  data: any[];
  stickyColumnCount?: number;
  editMode?: boolean;
  editFunction?: EditFunction;
  searchText?: string;
  groupBy?: string;
  numbered?: boolean; // Nueva propiedad para controlar la numeración
}

const GeneralTable: React.FC<GeneralTableProps> = ({
  columns,
  data,
  stickyColumnCount = 1,
  editMode = false,
  editFunction,
  searchText,
  groupBy,
  numbered = false, // Valor por defecto false
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [openCategories, setOpenCategories] = useState<{[key: string]: boolean}>({});

  // Crear la columna de numeración
  const numberColumn: Column = {
    key: 'tableNumber',
    title: '#',
    sticky: true,
    textAlign: 'center',
    editable: false,
    minWidth: 50,
    maxWidth: 50,
  };

  // Ajustar las columnas basado en si numbered es true
  const adjustedColumns = numbered ? [numberColumn, ...columns] : columns;
  const adjustedStickyColumnCount = numbered ? stickyColumnCount + 1 : stickyColumnCount;

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchText && searchText !== '') {
        const lowerCaseSearchText = searchText.toLowerCase();
        const newFilteredData = data
          .map((row, index) => ({ ...row, originalIndex: index }))
          .filter((row) => {
            const rowValues = Object.values(row);
            return rowValues.some((value) => typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchText));
          });
        setFilteredData(newFilteredData);
      } else {
        setFilteredData(data.map((row, index) => ({ ...row, originalIndex: index })));
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

  const groupedData = groupBy ? filteredData.reduce((groups: { [key: string]: any[] }, item) => {
    const groupKey = item[groupBy] || 'No group';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {}) : { '': filteredData };

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

  const getColumnValue = (row: any, column: Column, editMode: boolean, rowIndex: number, globalIndex: number) => {
    // Si es la columna de numeración, retornar el número
    if (numbered && column.key === 'tableNumber') {
      return globalIndex + 1;
    }
    
    const value = row[column.key];
    if (column.type === 'double-data') return renderDoubleData(row, column);
    if (!editMode && column.type) return formatValue(value, column.type, column.switchValues);
    if (!column.editable && column.type) return formatValue(value, column.type, column.switchValues);
    if (editMode && column.editable) return renderEditableInput(value, column.type || 'text', rowIndex, column.key, column?.switchValues);
    return formatValue(value, column.type || 'text', column.switchValues);
  };

  const formatValue = (value: any, type: string, switchValues?: { left: any, neutral: any, right: any }) => {
    switch (type) {
      case 'hour': return getHourMinutesFomISO(value, true);
      case 'seconds': return value ? secondsToMinSec(value) : '-- : --';
      case 'number': return value != null ? value.toString() : '--';
      case 'boolean': return value ? '✓' : '✗';
      case 'switch': return value === switchValues?.left ? -1 : value === switchValues?.right ? 1 : 0;
      case 'currency': return value != null ? formatCurrency(value) : '--';
      default: return value?.toString().toUpperCase() || '--';
    }
  };

  const handleEdit = (rowIndex: number, rowKey: string, newValue: any, type: string) => {
    const updatedData = [...filteredData];
    const dataIndex = updatedData[rowIndex].originalIndex; // Use originalIndex to locate in original data
    if (dataIndex !== -1) {
      updatedData[rowIndex] = { ...updatedData[rowIndex], [rowKey]: newValue };
      setFilteredData(updatedData);
      if (editFunction) editFunction(dataIndex, rowKey, newValue, type); // Pass original index to editFunction
    }
  };

  const renderEditableInput = (value: any, type: string, rowIndex: number, rowKey: string, switchValues?: { left: any; neutral: any; right: any }) => {
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
      case 'boolean': return <IonCheckbox class="table-checkbox" checked={value} onIonChange={(e) => handleChange(e.detail.checked)} />;
      case 'switch':
        const rangeValue = value === switchValues?.left ? -1 : value === switchValues?.right ? 1 : 0;
        return (
          <IonRange min={-1} max={1} step={1} snaps class={rangeValue === -1 ? 'switch negative' : rangeValue === 1 ? 'switch positive' : 'switch neutral'} value={rangeValue} onIonChange={(e) => handleChange(e.detail.value)} />
        );
      case 'hour': return <IonInput type="time" value={getHourMinutesFomISO(value)} onIonChange={(e) => handleChange(e.detail.value)} />;
      case 'number': case 'currency': return <IonInput type="number" value={value} onIonChange={(e) => handleChange(e.detail.value)} />;
      case 'seconds':
        const [minutes, seconds] = secondsToMinSec(value).split(':');
        return (
          <div className="editable-minute">
            <IonInput type="number" value={minutes} onIonChange={(e) => handleChange(`${e.detail.value}:${seconds}`)} />
            <p>:</p>
            <IonInput type="number" value={seconds} onIonChange={(e) => handleChange(`${minutes}:${e.detail.value}`)} />
          </div>
        );
      case 'double-data': default: return <IonInput type="text" value={value} onIonChange={(e) => handleChange(e.detail.value)} />;
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const renderCategoryDropdown = (category: string, count: number) => (
    <div className="table-dropdown category-item-title ion-flex ion-justify-content-between ion-padding-start background-tertiary-dark" onClick={() => toggleCategory(category)}>
      <p className="ion-flex ion-align-items-center">
        <HighlightedText text={`${category} (${count})`} searchTerm={searchText || ''} />
      </p>
      <div className="categories-card-buttons-wrapper ion-flex ion-align-items-center">
        <DropDownButton open={openCategories[category]} />
      </div>
    </div>
  );

  return (
    <div className={`table-container ${editMode ? 'edit-mode' : ''}`}>
      {Object.entries(groupedData).map(([groupKey, groupData]) => (
        // Use groupKey alone as it should already be unique
        <div key={groupKey} className="category-item">
          {groupBy && renderCategoryDropdown(groupKey, groupData.length)}
          {(!groupBy || !openCategories[groupKey]) && (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    {adjustedColumns.map((column) => (
                      // Use column.key as it should be unique within the columns array
                      <th 
                        key={column.key} 
                        className={column.sticky ? 'sticky-column' : ''} 
                        style={{
                          left: '0px',
                          minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                          maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
                        }}
                      >
                        {column.title.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupData.map((row, index) => (
                    // Use row.originalIndex as the unique identifier for the row
                    <tr key={`row-${row.originalIndex || index }-${groupKey}`} className={editMode ? 'edit-mode' : ''}>
                      {adjustedColumns.map((column) => (
                        // Combine row and column identifiers for a unique cell key
                        <td 
                          key={`cell-${row.originalIndex}-${column.key}`} 
                          className={column.sticky ? 'sticky-column' : ''} 
                          style={{ 
                            left: '0px', 
                            textAlign: column.textAlign || 'center', 
                            backgroundColor: row[column.backgroundColor as keyof typeof row],
                            minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                            maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
                          }}
                        >
                          {getColumnValue(row, column, editMode, row.originalIndex, groupData.indexOf(row))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralTable;
