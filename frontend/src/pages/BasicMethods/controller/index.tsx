import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  defaultFormValues,
  handleAllMethods,
  handleSlopeClimbingMethod,
  handleSlopeClimbingTryMethod,
  handleTemperatureMethod,
  Method,
} from '../helpers';
import { FormInputs } from '@/types';
import { ResponseData } from '@/interfaces';
import { BasicMethodsView } from '../view';
import { DataInterface } from '../components/DataView';
import { useKnapsackSetup } from '@/hooks/useKnapsackSetup';

export const BasicMethodsController = () => {
  const [biggestKnapsackLength, setBiggestKnapsackLength] = useState(20);
  const [biggestKnapsackWeight, setBiggestKnapsackWeight] = useState(45);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<DataInterface[]>([]);
  const [method, setMethod] = useState<Method | 'default'>('default');
  const { register, handleSubmit, setValue } = useForm<FormInputs>({
    defaultValues: defaultFormValues,
  });
  const { knapsackProblem, initialSolution, currentValues, setupKnapsacks } =
    useKnapsackSetup();

  const disableButton = method === 'default' || loading;

  useEffect(() => {
    setValue('method', method);
  }, [method, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
    setLoading(true);
    try {
      const { problem, solutions, current_values, maxKnapsackWeights } =
        await setupKnapsacks(biggestKnapsackLength, biggestKnapsackWeight);

      let response: ResponseData[] = [];
      const payloadBase = {
        costs: problem.costs,
        weights: problem.weights,
        solutions,
        current_values,
        maximum_weights: maxKnapsackWeights,
      };

      switch (formData.method) {
        case Method.TEMPERA:
          response = await handleTemperatureMethod({
            ...payloadBase,
            reducer_factor: formData.reducer_factor,
            final_temperature: formData.final_temperature,
            initial_temperature: formData.initial_temperature,
          });
          break;
        case Method.SLOPE_CLIMBING_TRY_AGAIN:
          response = await handleSlopeClimbingTryMethod({
            ...payloadBase,
            Tmax: formData.Tmax,
          });
          break;
        case Method.SLOPE_CLIMBING:
          response = await handleSlopeClimbingMethod(payloadBase);
          break;
        case Method.ALL:
          response = await handleAllMethods({
            ...payloadBase,
            Tmax: formData.Tmax,
            reducer_factor: formData.reducer_factor,
            final_temperature: formData.final_temperature,
            initial_temperature: formData.initial_temperature,
          });
          break;
        default:
          break;
      }

      if (response) {
        const newData: DataInterface[] = response.map((res) => ({
          method: res.method ?? formData.method,
          newValue: res.current_values,
          newSolution: res.solutions,
          currentValues,
          initialSolution,
          ...knapsackProblem,
        }));
        setAllData((prev) => [...prev, ...newData]);
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
