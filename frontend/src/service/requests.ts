import {
  CalcParams,
  GenerateKnapsackProblemParams,
  InitialBagSolutionParams,
  EvaluateBagSolutionParams,
} from './types';

const BASE_URL = 'http://localhost:5000';

export async function calc({
  bounds,
  coefficient_inequality,
  right_hand_inequality,
  objective,
}: CalcParams) {
  const response = await fetch(`${BASE_URL}/calc/simplex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bounds,
      coefficient_inequality,
      right_hand_inequality,
      objective,
    }),
  });
  const data = await response.json();
  return data;
}

export async function generateKnapsackProblem({
  n,
  min,
  max,
}: GenerateKnapsackProblemParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/problem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ n: n, min: min, max: max }),
  });
  const data = await response.json();
  return data;
}

export async function initialBagSolution({
  n,
  max,
  weight,
}: InitialBagSolutionParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/initial_solution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ n: n, max: max, weight: weight }),
  });
  const data = await response.json();
  return data;
}

export async function evaluateBagSolution({
  n,
  solution,
  max,
}: EvaluateBagSolutionParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/evaluate_solution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ n, solution, max }),
  });
  const data = await response.json();
  return data;
}

export async function sendSlopeClimbingData({
  max_weights,
  weights,
  costs,
  solutions,
  current_values,
}: {
  max_weights: number[];
  weights: number[];
  costs: number[];
  solutions: number[];
  current_values: number[];
}) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/slope_climb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      max_weights,
      weights,
      costs,
      solutions,
      current_values,
    }),
  });
  const data = await response.json();
  return data;
}
