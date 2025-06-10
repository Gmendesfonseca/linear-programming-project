import { MethodParam } from '@/types';

export const Tempera: React.FC<MethodParam> = ({ register }) => {
  return (
    <>
      <label className="text-lg">Tmax:</label>
      <input
        step="1"
        type="number"
        className="bg-white"
        {...register('Tmax', { required: true })}
      />
      <label>Fator de Redução</label>
      <input
        step="0.01"
        type="number"
        className="bg-white"
        {...register('reducer_factor')}
      />
      <label>Temperatura Inicial</label>
      <input
        step="0.01"
        type="number"
        className="bg-white"
        {...register('initial_temperature')}
      />
      <label>Temperatura Final</label>
      <input
        step="0.01"
        type="number"
        className="bg-white"
        {...register('final_temperature')}
      />
    </>
  );
};
