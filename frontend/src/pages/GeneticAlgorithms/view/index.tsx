import { FC } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { GeneticAlgorithmResponse, KnapsackProblem } from '@/service/types';
import { Card } from '@/components/ui/card';
import { AGConfig, ExtendedGeneticAlgorithmResponse } from '../types';
import { ConfigurationSection } from '../components/ConfigurationSection';
import { ActionSection } from '../components/ActionSection';
import { ProblemDisplaySection } from '../components/ProblemDisplaySection';
import { ResultsSection } from '../components/ResultsSection';

interface GeneticAlgorithmsViewProps {
  config: AGConfig;
  result?: ExtendedGeneticAlgorithmResponse | null;
  isLoading?: boolean;
  isGeneratingProblem?: boolean;
  handleConfigChange: (key: keyof AGConfig, value: number) => void;
  generateProblem: () => void;
  executeAG: () => void;
  analyzeAG: () => void;
  knapsackProblem: KnapsackProblem;
  initialSolution: number[][];
  currentValues: number[];
  knapsacksLengths: number[];
  problemGenerated: boolean;
  calculateBestValue: (
    solutions: GeneticAlgorithmResponse['solutions']
  ) => number;
  calculateTotalValue: (
    solutions: GeneticAlgorithmResponse['solutions']
  ) => number;
}

export const GeneticAlgorithmsView: FC<GeneticAlgorithmsViewProps> = ({
  config,
  handleConfigChange,
  isGeneratingProblem,
  isLoading,
  result,
  analyzeAG,
  executeAG,
  generateProblem,
  knapsackProblem,
  initialSolution,
  currentValues,
  knapsacksLengths,
  problemGenerated,
  calculateBestValue,
  calculateTotalValue,
}) => {
  return (
    <MainLayout>
      <Card
        style={{
          padding: '20px',
          marginBottom: '20px',
          width: '100%',
        }}
      >
        <h1 className="text-3xl font-bold mb-6">Algoritmo Genético</h1>

        {/* Configuration Section */}
        <ConfigurationSection
          config={config}
          handleConfigChange={handleConfigChange}
        />

        {/* Action Buttons */}
        <ActionSection
          analyzeAG={analyzeAG}
          generateProblem={generateProblem}
          executeAG={executeAG}
          isGeneratingProblem={isGeneratingProblem}
          isLoading={isLoading}
          problemGenerated={problemGenerated}
        />

        {/* Problem Data Display */}
        {problemGenerated && knapsackProblem.costs.length > 0 && (
          <ProblemDisplaySection
            currentValues={currentValues}
            initialSolution={initialSolution}
            knapsackProblem={knapsackProblem}
            knapsacksLengths={knapsacksLengths}
          />
        )}

        {/* Results Display */}
        {result && (
          <ResultsSection
            calculateBestValue={calculateBestValue}
            calculateTotalValue={calculateTotalValue}
            result={result}
          />
        )}
      </Card>
    </MainLayout>
  );
};
