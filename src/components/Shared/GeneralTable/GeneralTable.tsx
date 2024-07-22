import React from 'react';
import { IonContent } from '@ionic/react';
import './GeneralTable.css';

interface Column {
  key: string;
  title: string;
  sticky?: boolean;
}

interface GeneralTableProps {
  columns: Column[];
  data: any[];
  stickyColumnCount?: number;
}

const GeneralTable: React.FC<GeneralTableProps> = ({ columns, data, stickyColumnCount = 1 }) => {
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
                  {column.title}
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
                    style={{left: `${colIndex * 150}px`}}
                  >
                    {row[column.key]}
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