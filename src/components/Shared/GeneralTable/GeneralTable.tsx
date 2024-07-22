import React from 'react';
import './GeneralTable.css';
import getHourMinutesFomISO from '../../../utils/getHoursMinutesFromISO';
import { IonInput } from '@ionic/react';
import zIndex from '@mui/material/styles/zIndex';

export interface Column {
  key: string;
  title: string;
  sticky?: boolean;
  type?: 'text' | 'hour';
  textAlign?: 'left' | 'center' | 'right';
}

interface GeneralTableProps {
  columns: Column[];
  data: any[];
  stickyColumnCount?: number;
  editMode?: boolean;
}

const GeneralTable: React.FC<GeneralTableProps> = ({ columns, data, stickyColumnCount = 1, editMode = false }) => {
  const getColumnValue = (row: any, column: Column) => {
    if(!editMode) {
      if (column.type === 'hour') {
        return getHourMinutesFomISO(row[column.key]);
      }
    } else {
      if (column.type === 'hour') {
      return (
        <IonInput
          type="time" 
          value={getHourMinutesFomISO(row[column.key])}
          onIonChange={(e) => row[column.key] = e.detail.value}
          style={{width: 'auto'}}
        />)
      }
    }
    return row[column.key] && row[column.key].toString().toUpperCase() || '--';
  }

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
                    {getColumnValue(row, column)}
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