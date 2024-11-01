import React, { useEffect, useState } from 'react';
import './GeneralTable.css';
import {
  IonInput, IonCheckbox, IonRange
} from '@ionic/react';
import getHourMinutesFomISO from '../../../utils/getHoursMinutesFromISO';
import timeToISOString from '../../../utils/timeToIsoString';
import secondsToMinSec from '../../../utils/secondsToMinSec';
import minSecToSeconds from '../../../utils/minSecToSeconds';
import HighlightedText from '../HighlightedText/HighlightedText';
import DropDownButton from '../DropDownButton/DropDownButton';

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
}

interface GeneralTableProps {
  columns: Column[];
  data: any[];
  stickyColumnCount?: number;
  editMode?: boolean;
  editFunction?: (rowIndex: any, rowKey: any, rowValue: any, type: any) => void;
  searchText?: string;
  groupBy?: string;
}

const GeneralTable: React.FC<GeneralTableProps> = ({
  columns, data, stickyColumnCount = 1, editMode = false, editFunction, searchText, groupBy,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [openCategories, setOpenCategories] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchText && searchText !== '') {
        const lowerCaseSearchText = searchText.toLowerCase();
        const newFilteredData = data.filter((row) => {
          const rowValues = Object.values(row);
          return rowValues.some((value) => typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchText));
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

  const groupedData = groupBy ? filteredData.reduce((groups: { [key: string]: any[] }, item) => {
    const groupKey = item[groupBy] || 'Sin grupo';
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

  const getColumnValue = (row: any, column: Column, editMode: boolean, rowIndex: number) => {
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
    const dataIndex = data.findIndex((item) => item === filteredData[rowIndex]);
    if (dataIndex !== -1) {
      updatedData[rowIndex] = { ...updatedData[rowIndex], [rowKey]: newValue };
      setFilteredData(updatedData);
      if (editFunction) editFunction(dataIndex, rowKey, newValue, type);
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
    <div className={
      `table-container ${editMode ? 'edit-mode' : ''}`
    }>
      {Object.keys(groupedData).map((groupKey) => (
        <div key={groupKey}>
          {groupBy && renderCategoryDropdown(groupKey, groupedData[groupKey].length)}
          {(!groupBy || !openCategories[groupKey]) && (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={column.key} className={index < stickyColumnCount ? 'sticky-column' : ''} style={{ left: `${index * 150}px` }}>
                        {column.title.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedData[groupKey].map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={`${rowIndex}-${column.key}`} className={colIndex < stickyColumnCount ? 'sticky-column' : ''} style={{ left: `${colIndex * 150}px`, textAlign: column.textAlign || 'center', backgroundColor: row[column.backgroundColor as any] }}>
                          {getColumnValue(row, column, editMode, rowIndex)}
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