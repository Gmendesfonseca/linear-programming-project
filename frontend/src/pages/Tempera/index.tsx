import { TemperatureParams } from '@/service/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { sendTemperatureData } from '@/service/requests';
import { MethodsProps } from '@/pages/BasicMethods';

type TemperaInputs = {
  reducer_factor: number;
  initial_temperature: number;
  final_temperature: number;
  Tmax: number;
};

export default function Tempera({
  setNewValue,
  setNewSolution,
  ...params
}: MethodsProps) {
  const { register, handleSubmit } = useForm<TemperaInputs>({
    defaultValues: {
      Tmax: 10,
      reducer_factor: 0.95,
      final_temperature: 0.1,
      initial_temperature: 10,
    },
  });

  const onSubmit: SubmitHandler<TemperaInputs> = ({
    reducer_factor,
    initial_temperature,
    final_temperature,
    Tmax,
  }) => {
    const payload: TemperatureParams = {
      reducer_factor,
      initial_temperature,
      final_temperature,
      Tmax,
      // Rename properties to match TemperatureParams type
      maximum_weights: params.maximumWeights,
      current_values: params.currentValues,
      costs: params.costs,
      weights: params.weights,
      solution: params.solutions,
    };
    sendTemperatureData(payload).then((response) => {
      setNewValue(response.current_values);
      setNewSolution(response.solutions);
    });
  };

  return (
    <div
      className="flex flex-col items-center bg-gray-100 w-full h-fit"
      style={{ padding: '16px 0' }}
    >
      <h1>Têmpera</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <label>Fator de Redução</label>
        <input
          type="number"
          step="0.01"
          {...register('reducer_factor')}
          className="bg-white"
        />
        <label>Temperatura Inicial</label>
        <input
          type="number"
          step="0.01"
          {...register('initial_temperature')}
          className="bg-white"
        />
        <label>Temperatura Final</label>
        <input
          type="number"
          step="0.01"
          {...register('final_temperature')}
          className="bg-white"
        />
        <label>Tmax</label>
        <input type="number" {...register('Tmax')} className="bg-white" />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
