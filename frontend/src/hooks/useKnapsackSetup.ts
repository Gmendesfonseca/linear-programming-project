import { useState } from 'react';
import {
  generateKnapsackProblem,
  initialBagSolution,
  evaluateBagSolution,
} from '@/service/requests';
import { KnapsackProblem, Knapsacks } from '@/service/types';
import { randomSplitInt } from '@/utils/randomSplit';
import { MAX_ITEMS_WEIGHTS } from '@/utils/contants';

export function useKnapsackSetup() {
  const [knapsackProblem, setKnapsackProblem] = useState<KnapsackProblem>({
    weights: [],
    costs: [],
  });
  const [initialSolution, setInitialSolution] = useState<number[][]>([]);
  const [currentValues, setCurrentValues] = useState<number[]>([]);
  const [knapsacksLengths, setKnapsacksLengths] = useState<number[]>([]);

  const setupKnapsacks = async (
    biggestKnapsackLength: number,
    biggestKnapsackWeight: number,
  ) => {
    const randomKnapsacksNumber = Math.floor(Math.random() * 10) + 1;
    const lengths = randomSplitInt(
      biggestKnapsackLength,
      randomKnapsacksNumber,
    );
    const maxWeights = randomSplitInt(
      biggestKnapsackWeight,
      randomKnapsacksNumber,
    );

    setKnapsacksLengths(lengths);

    const { problem } = await generateKnapsackProblem({
      minimum_weight: 1,
      maximum_weight: MAX_ITEMS_WEIGHTS,
      knapsacks_length: lengths,
    });
    setKnapsackProblem(problem);

    const { solutions } = await initialBagSolution({
      weights: problem.weights,
      knapsacks_length: lengths,
      maximum_weights: maxWeights,
    });
    setInitialSolution(solutions);

    const knapsacks: Knapsacks[] = solutions.map(
      (solution: number[], index: number) => ({
        solution: solution,
        weights: problem.weights[index],
        costs: problem.costs[index],
      }),
    );

    const { current_values } = await evaluateBagSolution({
      knapsacks,
    });
    setCurrentValues(current_values);

    return {
      problem,
      solutions,
      current_values,
      maxKnapsackWeights: maxWeights,
      knapsacksLengths: lengths,
    };
  };

  return {
    knapsackProblem,
    initialSolution,
    currentValues,
    knapsacksLengths,
    setupKnapsacks,
  };
}
