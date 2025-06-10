import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  evaluateBagSolution,
  generateKnapsackProblem,
  initialBagSolution,
  sendTemperatureData,
  sendSlopeClimbingData,
  sendSlopeClimbingTryData,
} from '@/service/requests';
import {
  KnapsackProblem,
  TemperatureParams,
  SlopeClimbingParams,
  SlopeClimbingTryParams,
} from '@/service/types';
import { randomSplitInt } from '@/utils/randomSplit';
import { defaultFormValues, Method } from '../helpers';
import { FormInputs } from '@/types';
import { ResponseData } from '@/interfaces';
import { BasicMethodsView } from '../view';
import { DataInterface } from '../components/DataView';

export const BasicMethodsController = () => {
  const [maxItemsWeight] = useState(10);
  const [biggestKnapsackLength, setBiggestKnapsackLength] = useState(20);
  const [biggestKnapsackWeight, setBiggestKnapsackWeight] = useState(45);
  const [loading, setLoading] = useState(false);
  const [addData, setAddData] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<number[]>([]);
  const [allData, setAllData] = useState<DataInterface[]>([]);
  const [newSolution, setNewSolution] = useState<number[][]>([]);
  const [currentValues, setCurrentValues] = useState<number[]>([]);
  const [method, setMethod] = useState<Method | 'default'>('default');
  const [initialSolution, setInitialSolution] = useState<number[][]>([]);
  const [knapsackProblem, setKnapsackProblem] = useState<KnapsackProblem>({
    weights: [],
    costs: [],
  });

  const disableButton = method === 'default' || loading;
  const { register, handleSubmit, setValue } = useForm<FormInputs>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    setValue('method', method);
  }, [method, setValue]);

  useEffect(() => {
    if (addData) {
      setAllData((prev) => [
        ...prev,
        {
          method,
          newValue,
          newSolution,
          currentValues,
          initialSolution,
          ...knapsackProblem,
        },
      ]);
      setAddData(false);
    }
  }, [
    method,
    addData,
    newValue,
    newSolution,
    currentValues,
    knapsackProblem,
    initialSolution,
  ]);

  const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
    setLoading(true);
    try {
      const randomKnapsacksNumber = Math.floor(Math.random() * 10) + 1;
      const knapsacksLengths = randomSplitInt(
        biggestKnapsackLength,
        randomKnapsacksNumber,
      );
      const maxKnapsackWeights = randomSplitInt(
        biggestKnapsackWeight,
        randomKnapsacksNumber,
      );

      const { problem } = await generateKnapsackProblem({
        minimum_weight: 1,
        maximum_weight: maxItemsWeight,
        knapsacks_length: knapsacksLengths,
      });
      setKnapsackProblem(problem);

      const { solutions } = await initialBagSolution({
        weights: problem.weights,
        knapsacks_length: knapsacksLengths,
        maximum_weights: maxKnapsackWeights,
      });
      setInitialSolution(solutions);

      const knapsacks = solutions.map((solution: number[], index: number) => ({
        solution,
        weights: problem.weights[index],
        costs: problem.costs[index],
      }));

      const { current_values } = await evaluateBagSolution({
        knapsacks,
      });
      setCurrentValues(current_values);

      let response: ResponseData | null = null;
      if (formData.method === Method.TEMPERA) {
        const payload: TemperatureParams = {
          Tmax: formData.Tmax,
          reducer_factor: formData.reducer_factor,
          final_temperature: formData.final_temperature,
          initial_temperature: formData.initial_temperature,
          costs: problem.costs,
          weights: problem.weights,
          solutions: solutions,
          current_values: current_values,
          maximum_weights: maxKnapsackWeights,
        };
        response = await sendTemperatureData(payload);
      } else if (formData.method === Method.SLOPE_CLIMBING_TRY_AGAIN) {
        const payload: SlopeClimbingTryParams = {
          Tmax: formData.Tmax,
          costs: problem.costs,
          weights: problem.weights,
          solutions,
          current_values: current_values,
          maximum_weights: maxKnapsackWeights,
        };
        response = await sendSlopeClimbingTryData(payload);
      } else if (formData.method === Method.SLOPE_CLIMBING) {
        const payload: SlopeClimbingParams = {
          costs: problem.costs,
          weights: problem.weights,
          solutions,
          current_values: current_values,
          maximum_weights: maxKnapsackWeights,
        };
        response = await sendSlopeClimbingData(payload);
      }
      if (response) {
        setNewValue(response.current_values);
        setNewSolution(response.solutions);
        setAddData(true);
      }
    } catch {
      alert('Erro ao enviar dados para o backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicMethodsView
      allData={allData}
      method={method}
      setMethod={setMethod}
      disableButton={disableButton}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
      setBiggestKnapsackLength={setBiggestKnapsackLength}
      setBiggestKnapsackWeight={setBiggestKnapsackWeight}
    />
  );
};
