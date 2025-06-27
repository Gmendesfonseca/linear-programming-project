import { ExperimentResults } from '../types';
import { calculateStats } from './calculateStats';

export function prepareMethodResults(results: ExperimentResults): Array<{
  name: string;
  data: number[];
  stats: { min: number; max: number; avg: number; std: number };
}> {
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

  const annealingResults = Object.entries(results.simulatedAnnealing).map(
    ([key, data]) => ({
      name: `Tempera Simulada ${key.replace('annealing', '')}`,
      data,
    }),
  );

  return [...baseResults, ...annealingResults].map((method) => ({
    ...method,
    stats: calculateStats(method.data),
  }));
}
