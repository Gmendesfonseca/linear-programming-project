import React from 'react';
import { Method } from '@/pages/BasicMethods/helpers';
import { DataTable } from '../DataTable';

export interface DataInterface {
  method: Method | 'default';
  costs: number[][];
  weights: number[][];
  newValue?: number[];
  currentValues: number[];
  newSolution?: number[][];
  initialSolution: number[][];
}

interface DataViewProps {
  allData: DataInterface[];
}

export const DataView: React.FC<DataViewProps> = ({ allData }) => {
  return (
    allData.length > 0 && (
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        <h2>Dados do Método</h2>
        {allData
          .slice()
          .reverse()
          .map((item, index) => (
            <DataTable key={index} index={allData.length - index} {...item} />
          ))}
      </div>
    )
  );
};
