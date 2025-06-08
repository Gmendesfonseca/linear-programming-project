import { useState } from 'react';
import { DataView } from './components/DataView';
import { MainLayout } from '../../components/MainLayout';
import { Methods } from './components/Methods';
import { ProblemDefinition } from './components/ProblemDefinition';
import {
  evaluateBagSolution,
  generateKnapsackProblem,
  initialBagSolution,
} from '@/service/requests';
import { KnapsackProblem } from '@/service/types';
import { randomSplitInt } from '@/utils/randomSplit';
import { Option } from '@/pages/BasicMethods/components/Methods';

export enum Method {
  SLOPE_CLIMBING = 'slope_climbing',
  SLOPE_CLIMBING_TRY_AGAIN = 'slope_climbing_try_again',
  TEMPERA = 'tempera',
  ALL = 'all',
}

export const MethodsLabels: Record<Method, string> = {
  [Method.SLOPE_CLIMBING]: 'Subida de Encosta',
  [Method.SLOPE_CLIMBING_TRY_AGAIN]: 'Subida de Encosta c/Tentativa',
  [Method.TEMPERA]: 'Tempera',
  [Method.ALL]: 'Todos',
};

const methodOptions: Option[] = [
  { value: Method.SLOPE_CLIMBING, label: MethodsLabels[Method.SLOPE_CLIMBING] },
  {
    value: Method.SLOPE_CLIMBING_TRY_AGAIN,
    label: MethodsLabels[Method.SLOPE_CLIMBING_TRY_AGAIN],
  },
  { value: Method.TEMPERA, label: MethodsLabels[Method.TEMPERA] },
  { value: Method.ALL, label: MethodsLabels[Method.ALL] },
];

export interface MethodsProps {
  costs: number[][];
  weights: number[][];
  solutions: number[][];
  maximumWeights: number[];
  currentValues: number[];
  setNewValue: React.Dispatch<React.SetStateAction<number[][]>>;
  setNewSolution: React.Dispatch<React.SetStateAction<number[][]>>;
}

const BasicMethods = () => {
  const [maxItemsWeight] = useState(10);
  const [biggestKnapsackLength, setBiggestKnapsackLength] = useState(20);
  const [biggestKnapsackWeight, setBiggestKnapsackWeight] = useState(45);
  const [loading, setLoading] = useState(false);
  const [newValue, setNewValue] = useState<number[][]>([]);
  const [newSolution, setNewSolution] = useState<number[][]>([]);
  const [currentValues, setCurrentValues] = useState<number[]>([]);
  const [method, setMethod] = useState<Method | 'default'>('default');
  const [initialSolution, setInitialSolution] = useState<number[][]>([]);
  const [maxKnapsackWeight, setMaxKnapsacksWeight] = useState<number[]>([]);
  const [knapsackProblem, setKnapsackProblem] = useState<KnapsackProblem>({
    weights: [],
    costs: [],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const randomKnapsacksNumber = Math.floor(Math.random() * 10) + 1;
    const knapsacksLengths = randomSplitInt(
      biggestKnapsackLength,
      randomKnapsacksNumber
    );
    const maxKnapsackWeights = randomSplitInt(
      biggestKnapsackWeight,
      randomKnapsacksNumber
    );

    try {
      const { problem } = await generateKnapsackProblem({
        minimum_weight: 1,
        maximum_weight: maxItemsWeight,
        knapsacks_length: knapsacksLengths,
      });
      setKnapsackProblem(problem);

      const { solutions } = await initialBagSolution({
        weights: problem.weights,
        knapsacks_length: knapsacksLengths,
        maximum_weights: maxKnapsackWeights,
      });
      setInitialSolution(solutions);

      const knapsacks = solutions.map((solution: number[], index: number) => ({
        solution,
        weights: problem.weights[index],
        costs: problem.costs[index],
      }));

      const { current_values } = await evaluateBagSolution({
        knapsacks,
      });
      setCurrentValues(current_values);

      setMaxKnapsacksWeight(maxKnapsackWeights);
    } catch (error) {
      console.error('Error generating knapsack problem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <form onSubmit={handleSubmit}>
        <ProblemDefinition
          setMax={setBiggestKnapsackWeight}
          initialOption="FIXED"
          setProblemLength={setBiggestKnapsackLength}
          onOptionChange={(option) => console.log(option)}
        />
        <Methods
          method={method}
          setMethod={setMethod}
          options={methodOptions}
          setNewValue={setNewValue}
          solutions={initialSolution}
          currentValues={currentValues}
          setNewSolution={setNewSolution}
          maximumWeights={maxKnapsackWeight}
          {...knapsackProblem}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <button
            style={{
              width: '200px',
              padding: '12px 16px',
              backgroundColor: '#3d3d3d',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Gerar
          </button>
        </div>
      </form>
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
            fontSize: '18px',
            color: '#3d3d3d',
          }}
        >
          <p>Carregando...</p>
        </div>
      )}
      {!loading && (
        <DataView
          data={{
            method,
            newValue,
            newSolution,
            currentValues,
            initialSolution,
            ...knapsackProblem,
          }}
        />
      )}
    </MainLayout>
  );
};

export default BasicMethods;
