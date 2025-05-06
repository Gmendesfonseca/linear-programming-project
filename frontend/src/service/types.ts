export type CalcParams = {
  coefficient_inequality: number[][];
  right_hand_inequality: number[];
  objective: number[];
  bounds: number[][];
};

export type GenerateKnapsackProblemParams = {
  n: number;
  min: number;
  max: number;
};

export type InitialBagSolutionParams = {
  n: number;
  max: number;
  weight: number[];
};

export type EvaluateBagSolutionParams = {
  n: number;
  solution: number[];
  max: number;
};
