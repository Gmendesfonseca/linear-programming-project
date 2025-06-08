import { SlopeClimbingParams, SlopeClimbingTryParams } from '@/service/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  sendSlopeClimbingData,
  sendSlopeClimbingTryData,
} from '@/service/requests';
import { MethodsProps, Method } from '@/pages/BasicMethods';

type InputsType = {
  Tmax: number;
};

interface EncostaProps extends MethodsProps {
  method: Method;
}

export default function Encosta({
  method,
  setNewValue,
  setNewSolution,
  ...params
}: EncostaProps) {
  const { register, handleSubmit } = useForm<InputsType>({
    defaultValues: {
      Tmax: 10, // Valor padrão para Tmax
    },
  });

  const onSubmit: SubmitHandler<InputsType> = ({ Tmax }: InputsType) => {
    if (method === Method.SLOPE_CLIMBING) {
      const payload: SlopeClimbingParams = {
        ...params,
        solution: params.solutions,
        maximum_weights: params.maximumWeights,
        current_values: params.currentValues,
      };
      sendSlopeClimbingData(payload).then((response) => {
        setNewValue(response.current_values);
        setNewSolution(response.solutions);
      });
    } else {
      const payload: SlopeClimbingTryParams = {
        ...params,
        Tmax,
        maximum_weights: params.maximumWeights,
        current_values: params.currentValues,
        solution: params.solutions,
      };
      sendSlopeClimbingTryData(payload).then((response) => {
        setNewValue(response.current_values);
        setNewSolution(response.solutions);
      });
    }
  };

  if (method === Method.SLOPE_CLIMBING) return null;

  return (
    <div
      className="flex flex-col items-center bg-gray-100 w-full h-fit"
      style={{ padding: '16px 0' }}
    >
      <h1>Encosta</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-lg">Tmax:</label>
        <input
          type="number"
          {...register('Tmax', { required: true })}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
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
