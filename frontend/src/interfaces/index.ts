import { Method } from '@/pages/BasicMethods/helpers';

export interface MethodsProps {
  costs: number[][];
  weights: number[][];
  solutions: number[][];
  maximumWeights: number[];
  currentValues: number[];
  setNewValue: React.Dispatch<React.SetStateAction<number[][]>>;
  setNewSolution: React.Dispatch<React.SetStateAction<number[][]>>;
}

export interface ResponseData {
  current_values: number[];
  solutions: number[][];
  method?: Method;
}
