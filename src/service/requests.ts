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
    body: JSON.stringify({ n, min, max }),
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
    body: JSON.stringify({ n, max, weight }),
  });
  const data = await response.json();
  return data;
}

export async function evaluateBagSolution({
  n,
  solution,
  m1,
}: EvaluateBagSolutionParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/evaluate_solution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ n, solution, m1 }),
  });
  const data = await response.json();
  return data;
}
