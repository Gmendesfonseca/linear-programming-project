import { ExperimentResults, MethodResult } from '../types';
import { calculateStats } from './calculateStats';

export function prepareMethodResults(
  results: ExperimentResults,
): MethodResult[] {
  const baseResults = [
    { name: 'Soluções Iniciais', data: results.initialSolutions },
    { name: 'Subida de Encosta', data: results.hillClimbing },
    {
      name: 'Subida de Encosta N Tentativas',
      data: results.hillClimbingNAttempts,
    },
    {
      name: 'Subida de Encosta 2N Tentativas',
      data: results.hillClimbing2NAttempts,
    },
    {
      name: 'Tempera Simulada',
      data: results.temperaResults,
    },
  ];

  // Configuration mapping for annealing variants
  const annealingConfigs: {
    [key: string]: { finalTemp: number; initialTemp: number; reducer: number };
  } = {
    annealing01: { finalTemp: 0.1, initialTemp: 1000, reducer: 0.8 },
    annealing02: { finalTemp: 0.1, initialTemp: 1000, reducer: 0.9 },
    annealing03: { finalTemp: 0.01, initialTemp: 1000, reducer: 0.8 },
    annealing04: { finalTemp: 0.1, initialTemp: 500, reducer: 0.8 },
    annealing05: { finalTemp: 0.1, initialTemp: 500, reducer: 0.9 },
    annealing06: { finalTemp: 0.01, initialTemp: 500, reducer: 0.8 },
    annealing07: { finalTemp: 0.1, initialTemp: 0, reducer: 0.8 },
    annealing08: { finalTemp: 0.1, initialTemp: 0, reducer: 0.9 },
    annealing09: { finalTemp: 0.01, initialTemp: 0, reducer: 0.8 },
  };

  const annealingResults = Object.entries(results.simulatedAnnealing).map(
    ([key, data]) => {
      const config = annealingConfigs[key];
      const configNumber = key.replace('annealing', '');

      let name = `Tempera Simulada ${configNumber}`;

      if (config) {
        name += ` (T₀=${config.initialTemp}, Tf=${config.finalTemp}, α=${config.reducer})`;
      }

      return {
        name,
        data,
      };
    },
  );

  return [...baseResults, ...annealingResults].map((method) => ({
    ...method,
    stats: calculateStats(method.data),
    executionTimes: [],
    improvements: [],
  }));
}
