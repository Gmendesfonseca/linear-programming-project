import { useState } from 'react';
import { useKnapsackSetup } from '@/hooks/useKnapsackSetup';
import { ReportsView } from '../view';
import { ReportsService } from '../service';
import { prepareMethodResults } from '../utils/prepareMethodResults';
import {
  GAReportData,
  MethodResult,
  ProblemConfig,
  AllResults,
  ExperimentResults,
} from '../types';

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

  const [results, setResults] = useState<ExperimentResults>({
    initialSolutions: [],
    hillClimbing: [],
    hillClimbingNAttempts: [],
    hillClimbing2NAttempts: [],
    temperaResults: [],
    simulatedAnnealing: {},
  });

  const [allResults, setAllResults] = useState<AllResults[]>([]);
  const [gaReportData, setGaReportData] = useState<GAReportData | null>(null);

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
    setAllResults([]);
    setGaReportData(null);
  }

  async function runExperiments() {
    setLoading(true);
    try {
      cleanupResults();

      const experimentResults = await reportsService.runIndividualExperiments(
        config,
      );

      console.log('Final results:', experimentResults);
      setResults(experimentResults);
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

      const { individualResults, allResults: allMethodsResults } =
        await reportsService.runAllMethodsExperiment(config);

      setResults({
        initialSolutions: individualResults.initialSolutions || [],
        hillClimbing: individualResults.hillClimbing || [],
        hillClimbingNAttempts: individualResults.hillClimbingNAttempts || [],
        hillClimbing2NAttempts: individualResults.hillClimbing2NAttempts || [],
        temperaResults: individualResults.temperaResults || [],
        simulatedAnnealing: individualResults.simulatedAnnealing || {},
      });

      setAllResults(allMethodsResults || []);
    } catch (error) {
      console.error('Error running all methods experiment:', error);
      alert('Error running all methods.');
    } finally {
      setLoading(false);
    }
  }

  async function runGeneticAlgorithmExperiments() {
    setLoading(true);
    try {
      const gaResults = await reportsService.runGeneticAlgorithmExperiments(
        config,
      );
      setGaReportData(gaResults);
    } catch (error) {
      console.error('Error running GA experiments:', error);
      alert('Error running GA experiments.');
    } finally {
      setLoading(false);
    }
  }

  async function runAllExperiments() {
    setLoading(true);
    try {
      cleanupResults();

      // Run basic methods first
      const experimentResults = await reportsService.runIndividualExperiments(
        config,
      );
      setResults(experimentResults);

      // Run all methods comparison
      const { allResults: allMethodsResults } =
        await reportsService.runAllMethodsExperiment(config);
      setAllResults(allMethodsResults || []);

      // Run genetic algorithms
      const gaResults = await reportsService.runGeneticAlgorithmExperiments(
        config,
      );
      setGaReportData(gaResults);

      alert('All experiments completed successfully!');
    } catch (error) {
      console.error('Error running all experiments:', error);
      alert('Error running all experiments.');
    } finally {
      setLoading(false);
    }
  }

  async function handleExportReport() {
    try {
      // Check if we have any data to export
      const hasBasicResults = results.initialSolutions.length > 0;
      const hasGAResults = gaReportData !== null;
      const hasAllResults = allResults.length > 0;

      if (!hasBasicResults && !hasGAResults && !hasAllResults) {
        alert(
          'No data available to export. Please run some experiments first.',
        );
        return;
      }

      await reportsService.exportReport({
        problemConfig: config,
        individualResults: results,
        allResults: allResults,
        gaReportData: gaReportData,
      });

      alert('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert(
        'Error exporting report: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async function handleExportCSV() {
    try {
      const hasBasicResults = results.initialSolutions.length > 0;
      const hasGAResults = gaReportData !== null;
      const hasAllResults = allResults.length > 0;

      if (!hasBasicResults && !hasGAResults && !hasAllResults) {
        alert(
          'No data available to export. Please run some experiments first.',
        );
        return;
      }

      await reportsService.exportReportAsCSV({
        problemConfig: config,
        individualResults: results,
        allResults: allResults,
        gaReportData: gaReportData,
      });

      alert('CSV report exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV report:', error);
      alert(
        'Error exporting CSV report: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  function getDataSummary() {
    const hasBasicResults = results.initialSolutions.length > 0;
    const hasGAResults = gaReportData !== null;
    const hasAllResults = allResults.length > 0;

    return {
      hasBasicResults,
      hasGAResults,
      hasAllResults,
      totalExperiments: results.initialSolutions.length,
      gaConfigurations: gaReportData?.experiments.length || 0,
      comparisonResults: allResults.length,
    };
  }

  return (
    <ReportsView
      loading={loading}
      config={config}
      methodResults={getMethodResults()}
      hasResults={results.initialSolutions.length > 0}
      gaReportData={gaReportData}
      onConfigChange={handleConfigChange}
      onRunExperiments={runExperiments}
      onRunAllMethods={runAllMethodsExperiment}
      onRunGeneticAlgorithm={runGeneticAlgorithmExperiments}
      onExportReport={handleExportReport}
    />
  );
};
