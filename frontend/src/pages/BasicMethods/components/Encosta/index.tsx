import { MethodParam } from '@/types';

export const Encosta: React.FC<MethodParam> = ({ register }) => {
  return (
    <>
      <label className="text-lg">Tmax:</label>
      <input
        step="1"
        type="number"
        className="bg-white"
        {...register('Tmax', { required: true })}
      />
    </>
  );
};
