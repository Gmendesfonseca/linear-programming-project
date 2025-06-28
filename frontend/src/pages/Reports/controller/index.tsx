import { useState } from 'react';
import { useKnapsackSetup } from '@/hooks/useKnapsackSetup';
import { ReportsView } from '../view';
import { ReportsService } from '../service';
import { prepareMethodResults } from '../utils/prepareMethodResults';
import { MethodResult, ProblemConfig } from '../types';

export const ReportsController = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ProblemConfig>({
    problemType: 'Knapsack Problem',
    solutionType: 'Heuristic',
    minLimit: 1,
    maxLimit: 10,
    problemSize: 20,
    capacity: 45,
  });
  const [results, setResults] = useState<{
    initialSolutions: number[];
    hillClimbing: number[];
    hillClimbingNAttempts: number[];
    hillClimbing2NAttempts: number[];
    temperaResults: number[];
    simulatedAnnealing: { [key: string]: number[] };
  }>({
    initialSolutions: [],
    hillClimbing: [],
    hillClimbingNAttempts: [],
    hillClimbing2NAttempts: [],
    temperaResults: [],
    simulatedAnnealing: {},
  });

  const { setupKnapsacks } = useKnapsackSetup();
  const reportsService = new ReportsService(setupKnapsacks);

  function handleConfigChange(
    field: keyof ProblemConfig,
    value: string | number,
  ) {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function getMethodResults(): MethodResult[] {
    return prepareMethodResults(results);
  }

  function cleanupResults() {
    setResults({
      initialSolutions: [],
      hillClimbing: [],
      hillClimbingNAttempts: [],
      hillClimbing2NAttempts: [],
      temperaResults: [],
      simulatedAnnealing: {},
    });
  }

  async function runExperiments() {
    setLoading(true);
    try {
      cleanupResults();

      const experimentResults = await reportsService.runIndividualExperiments(
        config,
      );

      console.log('Final results:', experimentResults);
      setResults({ ...experimentResults, temperaResults: [] });
    } catch (error) {
      console.error('Error running experiments:', error);
      alert('Error running experiments.');
    } finally {
      setLoading(false);
    }
  }

  async function runAllMethodsExperiment() {
    setLoading(true);
    try {
      cleanupResults();

      const { individualResults } =
        await reportsService.runAllMethodsExperiment(config);

      setResults({
        initialSolutions: individualResults.initialSolutions || [],
        hillClimbing: individualResults.hillClimbing || [],
        hillClimbingNAttempts: individualResults.hillClimbingNAttempts || [],
        hillClimbing2NAttempts: individualResults.hillClimbing2NAttempts || [],
        temperaResults: individualResults.temperaResults || [],
        simulatedAnnealing: individualResults.simulatedAnnealing || {},
      });
    } catch (error) {
      console.error('Error running all methods experiment:', error);
      alert('Error running all methods.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ReportsView
      loading={loading}
      config={config}
      methodResults={getMethodResults()}
      hasResults={results.initialSolutions.length > 0}
      onConfigChange={handleConfigChange}
      onRunExperiments={runExperiments}
      onRunAllMethods={runAllMethodsExperiment}
    />
  );
};
