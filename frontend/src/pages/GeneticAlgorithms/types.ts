import { GeneticAlgorithmResponse } from '@/service/types';

export interface AGConfig {
  problemSize: number;
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  generations: number;
  generationInterval: number;
  keepIndividuals: number;
  capacity: number;
}

export interface AnalysisConfig {
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  generations: number;
}

export interface AnalysisResult {
  config: AnalysisConfig;
  result: GeneticAlgorithmResponse;
}

export interface ExtendedGeneticAlgorithmResponse
  extends GeneticAlgorithmResponse {
  analysis?: AnalysisResult[];
}
